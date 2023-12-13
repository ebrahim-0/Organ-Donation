import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import "./RequestOrgan.css";
import VerificationInput from "react-verification-input";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../auth";
import { useDispatch } from "noval";

const RequestOrgan = () => {
  const [report, setReport] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const colRef = collection(db, "requestorgan");

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    address: "",
    familyContact: "",
    familyName: "",
    familyRelation: "",
    phoneNumber: "",
    birthDate: "",
    bloodType: "Blood Type",
    organ: "",
    priority: 0,
    moreTanOrgan: "",
    registerDate: new Date().toLocaleDateString(),
  });

  const [liverData, setLiverData] = useState({
    meldScore: "",
    cancer: "",
  });

  const [kidneyData, setKidneyData] = useState({
    hla: "6",
    moreTanOrgan: "",
    dialysis: "",
    dialysisDuration: "",
    diabetesTypeOne: "",
  });

  const [isIdValid, setIsIdValid] = useState(false);

  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

  const [familyContactFocus, setFamilyContact] = useState(false);

  const [search, setSearch] = useState(false);

  const idRef = useRef();

  useEffect(() => {
    if (formData.organ === "Liver") {
      if (liverData.meldScore > 22) {
        setFormData((prevData) => ({
          ...prevData,
          priority: +liverData.meldScore,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          meldScore: liverData.cancer === "Yes" ? 22 : +liverData.meldScore,
          priority: liverData.cancer === "Yes" ? 22 : +liverData.meldScore,
        }));
      }
    }

    if (formData.organ === "Kidney") {
      if (kidneyData.moreTanOrgan === "Yes") {
        setFormData((formData) => ({
          ...formData,
          priority: 100,
        }));
      } else if (
        kidneyData.moreTanOrgan === "No" &&
        kidneyData.dialysis === "No"
      ) {
        setFormData((formData) => ({
          ...formData,
          priority: 20,
        }));
      }

      if (kidneyData.dialysis === "Yes") {
        if (kidneyData.dialysisDuration === "Less Than Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 30 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "1Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 50 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "2Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 51 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "3Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 52 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "More Than") {
          setFormData((formData) => ({
            ...formData,
            priority: 53 + +kidneyData.hla,
          }));
        }
      } else {
        setFormData((formData) => ({
          ...formData,
          priority: 20,
        }));
      }
      if (kidneyData.diabetesTypeOne === "Yes") {
        if (kidneyData.dialysisDuration === "Less Than Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 31 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "1Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 51 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "2Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 52 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "3Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 53 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "More Than") {
          setFormData((formData) => ({
            ...formData,
            priority: 54 + +kidneyData.hla,
          }));
        }
      } else {
        if (kidneyData.dialysisDuration === "Less Than Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 30 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "1Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 50 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "2Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 51 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "3Year") {
          setFormData((formData) => ({
            ...formData,
            priority: 52 + +kidneyData.hla,
          }));
        } else if (kidneyData.dialysisDuration === "More Than") {
          setFormData((formData) => ({
            ...formData,
            priority: 53 + +kidneyData.hla,
          }));
        }
      }
    }
  }, [
    liverData.meldScore,
    liverData.moreTanOrgan,
    liverData.cancer,
    formData.organ,
    kidneyData.moreTanOrgan,
    kidneyData.dialysis,
    kidneyData.hla,
    kidneyData.dialysisDuration,
    kidneyData.diabetesTypeOne,
  ]);

  useEffect(() => {
    const checkIfIdExists = async () => {
      if (formData.id) {
        const querySnapshot = await getDocs(
          query(colRef, where("id", "==", formData.id)),
        );
        setIsIdValid(querySnapshot.empty);
      }
    };

    checkIfIdExists();
  }, [formData.id, colRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdValid) {
      toast.error(
        "This ID is already registered. Please use a different one.",
        {
          position: toast.POSITION.TOP_RIGHT,
        },
      );
      return;
    }

    if (!user) {
      alert("You should log in first.");
      navigate("/login");
      return;
    }

    setReport(true);
  };

  const handleOrgan = (e) => {
    setFormData((formData) => ({
      ...formData,
      organ: e.target.textContent,
    }));
  };

  const { dispatch } = useDispatch();

  const handleCancer = (e) => {
    const value = e.target.value;
    setLiverData({ ...liverData, cancer: value });
  };

  const handleLiver = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      address: formData.address,
      id: formData.id,
      birthDate: formData.birthDate,
      bloodType: formData.bloodType,
      familyContact: "+966" + formData.familyContact,
      familyName: formData.familyName,
      familyRelation: formData.familyRelation,
      phoneNumber: "+966" + formData.phoneNumber,
      userId: user.uid,
      organ: formData.organ,
      priority: formData.priority,
      meldScore: liverData.meldScore,
      cancer: liverData.cancer,
      createAt: new Date().toLocaleString(),
    };

    try {
      const colRef = collection(db, "requestorgan");

      const docRef = await addDoc(colRef, data);

      // Update documents with unique IDs
      await updateDoc(doc(db, "requestorgan", docRef.id), {
        ...data,
        unique: docRef.id,
      });

      dispatch(
        {
          ...data,
          unique: docRef.id,
        },
        "requests",
      );

      toast.success("The Recipient Registered Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      setTimeout(() => {
        navigate("/requestsadded");
      }, 2000);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleKidney = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      address: formData.address,
      id: formData.id,
      birthDate: formData.birthDate,
      bloodType: formData.bloodType,
      familyContact: "+966" + formData.familyContact,
      familyName: formData.familyName,
      familyRelation: formData.familyRelation,
      phoneNumber: "+966" + formData.phoneNumber,
      userId: user.uid,
      organ: formData.organ,
      priority: formData.priority,
      hla: kidneyData.hla,
      moreTanOrgan: kidneyData.moreTanOrgan,
      dialysis: kidneyData.dialysis,
      dialysisDuration: kidneyData.dialysisDuration,
      diabetesTypeOne: kidneyData.diabetesTypeOne,
      createAt: new Date().toLocaleString(),
    };

    try {
      if (kidneyData.moreTanOrgan === "Yes") {
        const colRef = collection(db, "requestorgan");

        const docRef = await addDoc(colRef, data);

        await updateDoc(doc(db, "requestorgan", docRef.id), {
          ...data,
          unique: docRef.id,
          organ: "All Organs",
        });

        dispatch(
          {
            ...data,
            unique: docRef.id,
            organ: "All Organs",
          },
          "requests",
        );

        toast.success("The Recipient Registered Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          navigate("/requestsadded");
        }, 2000);
      } else {
        const colRef = collection(db, "requestorgan");

        const docRef = await addDoc(colRef, data);

        // Update documents with unique IDs
        await updateDoc(doc(db, "requestorgan", docRef.id), {
          ...data,
          unique: docRef.id,
        });

        dispatch({ ...data, unique: docRef.id }, "requests");

        toast.success("The Recipient Registered Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          navigate("/requestsadded");
        }, 2000);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleMoreOrganKidney = (e) => {
    setKidneyData((formData) => ({
      ...formData,
      moreTanOrgan: e.target.value,
    }));

    if (e.target.value === "Yes") {
      setKidneyData((formData) => ({
        ...formData,
        dialysis: "",
        dialysisDuration: "",
        diabetesTypeOne: "",
      }));
    }
  };

  console.log(formData);

  return (
    <>
      {report ? (
        <>
          {search ? (
            (formData.organ === "Kidney" && (
              <form
                className="flex flex-col gap-9 w-3/4 ml-auto mr-[70px]"
                onSubmit={handleKidney}
              >
                <label className="flex justify-around gap-52">
                  <span className="text-2xl text-start">HLA</span>
                  <input
                    type="number"
                    min="6"
                    max="8"
                    className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
                    onChange={(e) => {
                      setKidneyData((formData) => ({
                        ...formData,
                        hla: e.target.value,
                      }));
                    }}
                    onInput={(e) =>
                      (e.target.value = Math.round(e.target.value))
                    }
                  />
                </label>
                <div className="flex justify-around items-center">
                  <p className="text-2xl text-start break-words w-96">
                    Does the patient need more than one organ transplantation?
                  </p>
                  <div className="flex items-center gap-7">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="moreOrgan"
                        value="Yes"
                        checked={kidneyData.moreTanOrgan === "Yes"}
                        onChange={handleMoreOrganKidney}
                        className="form-radio h-5 w-5 text-red-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="moreOrgan"
                        value="No"
                        checked={kidneyData.moreTanOrgan === "No"}
                        onChange={handleMoreOrganKidney}
                        className="form-radio h-5 w-5 text-red-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                {kidneyData.moreTanOrgan === "No" && (
                  <div className="flex flex-col gap-7">
                    <div className="flex justify-around items-center">
                      <p className="text-2xl text-start break-words w-96">
                        Is the patient on dialysis?
                      </p>
                      <div className="flex items-center gap-7">
                        <label className="inline-flex items-center space-x-2">
                          <input
                            type="radio"
                            name="dialysis"
                            value="Yes"
                            checked={kidneyData.dialysis === "Yes"}
                            onChange={(e) => {
                              setKidneyData((formData) => ({
                                ...formData,
                                dialysis: e.target.value,
                              }));
                            }}
                            className="form-radio h-5 w-5 text-red-600"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="inline-flex items-center space-x-2">
                          <input
                            type="radio"
                            name="dialysis"
                            value="No"
                            checked={kidneyData.dialysis === "No"}
                            onChange={(e) => {
                              setKidneyData((formData) => ({
                                ...formData,
                                dialysis: e.target.value,
                              }));
                            }}
                            className="form-radio h-5 w-5 text-red-600"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                    {kidneyData.dialysis === "Yes" && (
                      <>
                        <div className="flex justify-around items-center">
                          <p className="text-2xl text-start break-words w-64">
                            Dialysis duration
                          </p>
                          <div className="flex items-center gap-7">
                            <select
                              value={kidneyData.dialysisDuration}
                              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
                              onChange={(e) => {
                                setKidneyData((formData) => ({
                                  ...formData,
                                  dialysisDuration: e.target.value,
                                }));
                              }}
                            >
                              <option value="selectYear">Select Year</option>
                              <option value="Less Than Year">
                                Less Than Year
                              </option>
                              <option value="1Year">1Year</option>
                              <option value="2Year">2Year</option>
                              <option value="3Year">3Year</option>
                              <option value="More Than">More Than</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-around items-center">
                          <p className="text-2xl text-start break-words w-96">
                            Does the patient have diabetes type 1?
                          </p>
                          <div className="flex items-center gap-7">
                            <label className="inline-flex items-center space-x-2">
                              <input
                                type="radio"
                                name="dialysisTypeOne"
                                value="Yes"
                                checked={kidneyData.diabetesTypeOne === "Yes"}
                                onChange={(e) => {
                                  setKidneyData((formData) => ({
                                    ...formData,
                                    diabetesTypeOne: e.target.value,
                                  }));
                                }}
                                className="form-radio h-5 w-5 text-red-600"
                              />
                              <span>Yes</span>
                            </label>
                            <label className="inline-flex items-center space-x-2">
                              <input
                                type="radio"
                                name="dialysisTypeOne"
                                value="No"
                                checked={kidneyData.diabetesTypeOne === "No"}
                                onChange={(e) => {
                                  setKidneyData((formData) => ({
                                    ...formData,
                                    diabetesTypeOne: e.target.value,
                                  }));
                                }}
                                className="form-radio h-5 w-5 text-red-600"
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button className="py-2 px-12 w-fit mx-auto bg-[#0F58B6] text-slate-50 rounded-[10px] float-right">
                  Submit
                  <ToastContainer />
                </button>
              </form>
            )) ||
            (formData.organ === "Liver" && (
              <form
                className="flex flex-col gap-9 w-3/4 ml-auto mr-[70px]"
                onSubmit={handleLiver}
              >
                <label className="flex justify-around gap-12">
                  <span className="text-2xl text-start">MELD Score</span>
                  <input
                    type="number"
                    className="w-40 md:w-80 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
                    onChange={(e) => {
                      setLiverData((formData) => ({
                        ...formData,
                        meldScore: e.target.value,
                      }));
                    }}
                    onInput={(e) =>
                      (e.target.value = Math.round(e.target.value))
                    }
                  />
                </label>
                <div className="flex justify-around items-center">
                  <p className="text-2xl text-start break-words w-96">
                    Does the patient have cancer?
                  </p>
                  <div className="flex items-center gap-7">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="cancer"
                        value="Yes"
                        disabled={liverData.moreTanOrgan === "Yes"}
                        checked={liverData.cancer === "Yes"}
                        onChange={handleCancer}
                        className="form-radio h-5 w-5 text-red-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="radio"
                        name="cancer"
                        value="No"
                        disabled={liverData.moreTanOrgan === "Yes"}
                        checked={liverData.cancer === "No"}
                        onChange={handleCancer}
                        className="form-radio h-5 w-5 text-red-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <button className="py-2 px-12 w-fit mx-auto bg-[#0F58B6] text-slate-50 rounded-[10px] float-right">
                  Submit
                  <ToastContainer />
                </button>
              </form>
            ))
          ) : (
            <div className="flex flex-col gap-20 w-[300px] md:w-[500px] mx-auto">
              <div className="flex justify-center gap-10 mt-16">
                <div
                  className="p-3 border-2 border-[#3377FF] bg-[#D0DEEB] rounded w-60 text-center text-[#3377FF] text-xl font-extrabold cursor-pointer"
                  onClick={(e) => {
                    handleOrgan(e);
                    setSearch(true);
                  }}
                >
                  Kidney
                </div>
                <div
                  className="p-3 border-2 border-[#3377FF] bg-[#D0DEEB] rounded w-60 text-center text-[#3377FF] text-xl font-extrabold cursor-pointer"
                  onClick={(e) => {
                    handleOrgan(e);
                    setSearch(true);
                  }}
                >
                  Liver
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <form
          className="flex flex-col gap-6 w-[350px] md:w-[500px] mx-auto -mt-9"
          onSubmit={handleSubmit}
        >
          <h1>
            <strong>Recipient Information</strong>
          </h1>
          <label className="flex justify-between">
            Name:
            <input
              value={formData.name}
              required
              type="text"
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  name: e.target.value,
                }))
              }
            />
          </label>
          <label className="flex justify-between" required>
            ID:
            <VerificationInput
              validChars="0-9"
              length={10}
              placeholder=""
              ref={idRef}
              value={formData.id}
              onChange={() => {
                setFormData((formData) => ({
                  ...formData,
                  id: idRef.current.value,
                }));

                if (formData.id.length >= 9) {
                  setFormData((formData) => ({
                    ...formData,
                    validId: true,
                  }));
                }
              }}
              classNames={{
                container: "container",
                character: "character",
              }}
            />
          </label>
          <label className="flex justify-between">
            Address:
            <input
              value={formData.address}
              required
              type="text"
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  address: e.target.value,
                }))
              }
            />
          </label>

          <label className="flex justify-between">
            Phone Number
            <div className="flex items-center gap-1 bg-white w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]">
              <span>+996</span>
              <input
                required
                onChange={(e) => {
                  setFormData((formData) => ({
                    ...formData,
                    phoneNumber: e.target.value,
                  }));

                  if (formData.phoneNumber.length >= 10) {
                    setFormData((formData) => ({
                      ...formData,
                      validPhoneVal: true,
                    }));
                  }
                }}
                maxLength="9"
                onInput={(e) =>
                  (e.target.value = e.target.value.slice(0, e.target.maxLength))
                }
                onFocus={() => setPhoneNumberFocus(true)}
                onBlur={() => setPhoneNumberFocus(false)}
                className="bg-transparent outline-none"
                id="phoneNumber"
                type="Number"
                defaultValue={formData.phoneNumber}
              />
            </div>
          </label>
          <p className="text-red-500 italic text-center">
            {formData?.phoneNumber?.length < 9 &&
              phoneNumberFocus &&
              "Please enter a valid phone number"}
          </p>

          <label className="flex justify-between">
            Birth date:
            <input
              value={formData.birthDate}
              required
              onClick={(e) => e.target.showPicker()}
              max={new Date().toISOString().split("T")[0]}
              type="date"
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  birthDate: e.target.value,
                }))
              }
            />
          </label>

          <label className="flex justify-between">
            Blood_Type:
            <select
              defaultValue={formData.bloodType}
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  bloodType: e.target.value,
                }))
              }
            >
              <option disabled value={"Blood Type"}>
                Blood Type
              </option>
              <option value={"A"}>A</option>
              <option value={"B"}>B</option>
              <option value={"AB"}>AB</option>
              <option value={"O"}>O</option>
            </select>
          </label>

          <h1>
            <strong>Family Contact Information</strong>
          </h1>

          <label className="flex justify-between">
            Name:
            <input
              value={formData.familyName}
              required
              type="text"
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  familyName: e.target.value,
                }))
              }
            />
          </label>

          <label className="flex justify-between">
            Family_Relation:
            <select
              defaultValue={formData.familyRelation || "Family Relation"}
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  familyRelation: e.target.value,
                }))
              }
            >
              <option disabled value={"Family Relation"}>
                Family Relation
              </option>
              <option value={"Father"}>Father</option>
              <option value={"Mother"}>Mother</option>
              <option value={"Brother"}>Brother</option>
              <option value={"Sister"}>Sister</option>
              <option value={"Hasband"}>Hasband</option>
              <option value={"Wife"}>Wife</option>
              <option value={"Son"}>Son</option>
              <option value={"Daughter"}>Daughter</option>
            </select>
          </label>

          <label className="flex justify-between">
            Family_Contact:
            <div className="flex items-center gap-1 bg-white w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]">
              <span>+996</span>
              <input
                required
                onChange={(e) =>
                  setFormData((formData) => ({
                    ...formData,
                    familyContact: e.target.value,
                  }))
                }
                maxLength="9"
                onFocus={() => setFamilyContact(true)}
                onBlur={() => setFamilyContact(false)}
                onInput={(e) =>
                  (e.target.value = e.target.value.slice(0, e.target.maxLength))
                }
                className="bg-transparent outline-none"
                id="phoneNumber"
                type="Number"
                value={formData.familyContact}
              />
            </div>
          </label>
          <p className="text-red-500 italic text-center">
            {formData?.familyContact?.length < 9 &&
              familyContactFocus &&
              "Please enter a valid phone number"}
          </p>

          <div className="mt-5 mb-10 pt-9 border-t-[3px] border-[#0F58B6]">
            <button
              className="py-2 px-12 w-fit mx-auto bg-transparent text-[#0F58B6] rounded-[10px] border-[#0F58B6]  border-2 float-left"
              onClick={() => {
                setFormData((formData) => ({
                  name: "",
                  id: "",
                  address: "",
                  familyContact: "",
                  familyName: "",
                  familyRelation: "",
                  phoneVal: "",
                  birthDate: "",
                  bloodType: "",
                }));
              }}
            >
              Cancel
            </button>

            <button
              className="py-2 px-12 w-fit mx-auto bg-[#0F58B6] text-slate-50 rounded-[10px] float-right focus:outline-none focus:border-blue-300 focus:shadow-outline disabled:opacity-50"
              disabled={
                !formData?.name.length > 0 ||
                !formData?.id.length > 0 ||
                !formData?.address.length > 0 ||
                formData?.familyContact.length < 9 ||
                !formData?.familyName.length > 0 ||
                !formData?.familyRelation.length > 0 ||
                formData?.phoneNumber.length < 9 ||
                !formData?.birthDate.length > 0 ||
                !formData?.bloodType.length > 0 ||
                !formData?.validId
              }
            >
              Next
            </button>
            <ToastContainer />
          </div>
        </form>
      )}
    </>
  );
};

export default RequestOrgan;
