import { useDispatch, useSelector } from "noval";
import { ToastContainer, toast } from "react-toastify";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../auth";
import { useNavigate } from "react-router-dom";
import useMatchedRequests from "../Hook/useMatchedRequests";
import { useState } from "react";
import { useEffect } from "react";
import useGetNotification from "../Hook/useGetNotification";
import useGetRequests from "../Hook/useGetRequests";
import useGetRole from "../Hook/useGetRole";
import useFilterMatched from "../Hook/useFilterMatched";

export default function RequestsAdded() {
  const [requests] = useSelector(["requests"]);

  const navigate = useNavigate();

  const { notification } = useGetNotification();

  const [newNotification, setNewNotification] = useState(0);

  const [filterItem, setFilterItem] = useState(null);

  const { dispatch } = useDispatch();

  const { role } = useGetRole();

  useEffect(() => {
    const filterItem = notification.filter((val) => val.new === true).length;

    setNewNotification(filterItem);

    dispatch({ filterItem }, "newNotification");
  }, [notification]);

  let { filteredDonors, filteredAllDonorsKidney, filteredAllDonorsLiver } =
    useMatchedRequests(requests);

  console.log("requests", requests);

  console.log("filteredDonors", filteredDonors);

  console.log("filteredAllDonorsKidney", filteredAllDonorsKidney);
  console.log("filteredAllDonorsLiver", filteredAllDonorsLiver);

  const { filteredRecipients } = useFilterMatched("Kidney");
  const { filteredRecipients: filteredRecipientsLiver } =
    useFilterMatched("Liver");

  const allMatchedRequests = filteredRecipients
    .filter((val) => val.bloodType === requests.bloodType)
    .filter((val) => val.id !== requests.id)
    .sort(
      (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
    )
    .sort((a, b) => b.priority - a.priority);

  const allMatchedRequestsLiver = filteredRecipientsLiver
    .filter((val) => val.bloodType === requests.bloodType)
    .filter((val) => val.id !== requests.id)
    .sort(
      (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
    )
    .sort((a, b) => b.priority - a.priority);

  const { requests: allRequests } = useGetRequests();

  filteredDonors = filteredDonors.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  useEffect(() => {
    const index = allRequests
      .sort(
        (a, b) =>
          new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
      )
      .filter(
        (val) =>
          val.organ === requests.organ && val.bloodType === requests.bloodType,
      )
      .sort((a, b) => b.priority - a.priority)

      .findIndex((request) => request.id === requests.id);

    setFilterItem(index);
  }, [requests, allRequests]);

  const addMatch = async () => {
    try {
      const colRef = collection(db, "matched");

      if (requests.moreTanOrgan === "Yes") {
        if (filteredDonors.length > 0) {
          if (filteredDonors[0].organ === "All Organs") {
            await addDoc(colRef, {
              ...requests,
              idRecipient: requests.id,
              birthDateDonor: filteredDonors[0]?.birthDate,
              deathDateDonor: filteredDonors[0]?.deathDate,
              idDonor: filteredDonors[0]?.id,
              bloodTypeDonor: filteredDonors[0]?.bloodType,
              phoneNumberDonor: filteredDonors[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
            });

            if (allMatchedRequests[0]) {
              await addDoc(colRef, {
                ...allMatchedRequests[0],
                idRecipient: allMatchedRequests[0].id,
                birthDateDonor: filteredDonors[0]?.birthDate,
                deathDateDonor: filteredDonors[0]?.deathDate,
                idDonor: filteredDonors[0]?.id,
                bloodTypeDonor: filteredDonors[0]?.bloodType,
                phoneNumberDonor: filteredDonors[0]?.phoneNumber || "",
                matchedAt: new Date().toLocaleString(),
              });
              await deleteDoc(
                doc(db, "requestorgan", allMatchedRequests[0].unique),
              );
            }

            await deleteDoc(doc(db, "requestorgan", requests.unique));
            await deleteDoc(doc(db, "notification", filteredDonors[0].notiId));
            await deleteDoc(
              doc(db, "reportbraindeath", filteredDonors[0].unique),
            );

            console.log("in teh test kedny 50");

            toast.success("The Recipient(s) Registered Successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setTimeout(() => {
              navigate("/overview");
            }, 2000);
          }
        }
      } else {
        if (filteredDonors[0].organ === "All Organs") {
          if (requests.organ === "Liver") {
            const colRef = collection(db, "matched");

            await addDoc(colRef, {
              ...requests,
              idRecipient: requests.id,
              birthDateDonor: filteredDonors[0]?.birthDate,
              deathDateDonor: filteredDonors[0]?.deathDate,
              idDonor: filteredDonors[0]?.id,
              bloodTypeDonor: filteredDonors[0]?.bloodType,
              phoneNumberDonor: filteredDonors[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
            });

            await deleteDoc(doc(db, "requestorgan", requests.unique));

            console.log("in teh test kedny 5700");

            if (allMatchedRequests[0]) {
              await addDoc(colRef, {
                ...allMatchedRequests[0],
                idRecipient: allMatchedRequests[0].id,
                birthDateDonor: filteredAllDonorsKidney[0]?.birthDate,
                deathDateDonor: filteredAllDonorsKidney[0]?.deathDate,
                idDonor: filteredAllDonorsKidney[0]?.id,
                bloodTypeDonor: filteredAllDonorsKidney[0]?.bloodType,
                phoneNumberDonor: filteredAllDonorsKidney[0]?.phoneNumber || "",
                matchedAt: new Date().toLocaleString(),
              });
              await deleteDoc(
                doc(db, "requestorgan", allMatchedRequests[0].unique),
              );

              if (allMatchedRequests[1]) {
                await addDoc(colRef, {
                  ...allMatchedRequests[1],
                  idRecipient: allMatchedRequests[1].id,
                  birthDateDonor: filteredAllDonorsKidney[0]?.birthDate,
                  deathDateDonor: filteredAllDonorsKidney[0]?.deathDate,
                  idDonor: filteredAllDonorsKidney[0]?.id,
                  bloodTypeDonor: filteredAllDonorsKidney[0]?.bloodType,
                  phoneNumberDonor:
                    filteredAllDonorsKidney[0]?.phoneNumber || "",
                  matchedAt: new Date().toLocaleString(),
                });
                await deleteDoc(
                  doc(db, "requestorgan", allMatchedRequests[1].unique),
                );

                await deleteDoc(
                  doc(db, "notification", filteredDonors[0].notiId),
                );
                await deleteDoc(
                  doc(db, "reportbraindeath", filteredDonors[0].unique),
                );
              }

              await deleteDoc(
                doc(db, "notification", filteredDonors[0].notiId),
              );
              await deleteDoc(
                doc(db, "reportbraindeath", filteredDonors[0].unique),
              );
            } else {
              await deleteDoc(
                doc(db, "notification", filteredDonors[0].notiId),
              );
              await deleteDoc(
                doc(db, "reportbraindeath", filteredDonors[0].unique),
              );
            }

            toast.success("The Recipient(s) Registered Successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setTimeout(() => {
              navigate("/overview");
            }, 2000);
          }
        }

        if (filteredDonors[0].organ === "All Organs") {
          if (requests.organ === "Kidney") {
            const colRef = collection(db, "matched");

            await addDoc(colRef, {
              ...requests,
              idRecipient: requests.id,
              birthDateDonor: filteredDonors[0]?.birthDate,
              deathDateDonor: filteredDonors[0]?.deathDate,
              idDonor: filteredDonors[0]?.id,
              bloodTypeDonor: filteredDonors[0]?.bloodType,
              phoneNumberDonor: filteredDonors[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
            });

            await deleteDoc(doc(db, "requestorgan", requests.unique));

            if (allMatchedRequestsLiver[0]) {
              await addDoc(colRef, {
                ...allMatchedRequestsLiver[0],
                idRecipient: allMatchedRequestsLiver[0].id,
                birthDateDonor: filteredDonors[0]?.birthDate,
                deathDateDonor: filteredDonors[0]?.deathDate,
                idDonor: filteredDonors[0]?.id,
                bloodTypeDonor: filteredDonors[0]?.bloodType,
                phoneNumberDonor: filteredDonors[0]?.phoneNumber || "",
                matchedAt: new Date().toLocaleString(),
              });
              await deleteDoc(
                doc(db, "requestorgan", allMatchedRequestsLiver[0].unique),
              );

              await deleteDoc(
                doc(db, "notification", filteredDonors[0].notiId),
              );
              await deleteDoc(
                doc(db, "reportbraindeath", filteredDonors[0].unique),
              );
            } else {
              await deleteDoc(
                doc(db, "notification", filteredDonors[0].notiId),
              );
              await deleteDoc(
                doc(db, "reportbraindeath", filteredDonors[0].unique),
              );
            }

            console.log("in teh test liver 5700");

            toast.success("The Recipient(s) Registered Successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setTimeout(() => {
              navigate("/overview");
            }, 2000);
          }
        }

        console.log("oudttt");

        if (requests.organ === "Liver") {
          if (filteredDonors[0].organ === "Liver") {
            await addDoc(colRef, {
              ...requests,
              idRecipient: requests.id,
              birthDateDonor: filteredAllDonorsLiver[0]?.birthDate,
              deathDateDonor: filteredAllDonorsLiver[0]?.deathDate,
              idDonor: filteredAllDonorsLiver[0]?.id,
              bloodTypeDonor: filteredAllDonorsLiver[0]?.bloodType,
              phoneNumberDonor: filteredAllDonorsLiver[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
            });

            await deleteDoc(doc(db, "requestorgan", requests.unique));
            await deleteDoc(
              doc(db, "notification", filteredAllDonorsLiver[0].notiId),
            );
            await deleteDoc(
              doc(db, "reportbraindeath", filteredAllDonorsLiver[0].unique),
            );

            toast.success("The Recipient(s) Registered Successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setTimeout(() => {
              navigate("/overview");
            }, 2000);
          }
        }

        if (requests.organ === "Kidney") {
          if (filteredDonors[0].organ === "Kidney") {
            await addDoc(colRef, {
              ...requests,
              idRecipient: requests.id,
              birthDateDonor: filteredAllDonorsKidney[0]?.birthDate,
              deathDateDonor: filteredAllDonorsKidney[0]?.deathDate,
              idDonor: filteredAllDonorsKidney[0]?.id,
              bloodTypeDonor: filteredAllDonorsKidney[0]?.bloodType,
              phoneNumberDonor: filteredAllDonorsKidney[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
            });
            await deleteDoc(doc(db, "requestorgan", requests.unique));

            if (allMatchedRequests[0]) {
              await addDoc(colRef, {
                ...allMatchedRequests[0],
                idRecipient: allMatchedRequests[0].id,
                birthDateDonor: filteredAllDonorsKidney[0]?.birthDate,
                deathDateDonor: filteredAllDonorsKidney[0]?.deathDate,
                idDonor: filteredAllDonorsKidney[0]?.id,
                bloodTypeDonor: filteredAllDonorsKidney[0]?.bloodType,
                phoneNumberDonor: filteredAllDonorsKidney[0]?.phoneNumber || "",
                matchedAt: new Date().toLocaleString(),
              });
              await deleteDoc(
                doc(db, "requestorgan", allMatchedRequests[0].unique),
              );

              await deleteDoc(
                doc(db, "notification", filteredAllDonorsKidney[0].notiId),
              );
              await deleteDoc(
                doc(db, "reportbraindeath", filteredAllDonorsKidney[0].unique),
              );
            } else {
              await deleteDoc(
                doc(db, "notification", filteredAllDonorsKidney[0].notiId),
              );
              await deleteDoc(
                doc(db, "reportbraindeath", filteredAllDonorsKidney[0].unique),
              );
            }

            console.log("in teh test kedny 1");
            toast.success("The Recipient(s) Registered Successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setTimeout(() => {
              navigate("/overview");
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("done");
    }
  };

  return (
    <>
      <div className="flex items-start justify-center flex-col border-2 border-[#37F] bg-[#FFF] w-[486px]  h-[309px] mx-auto p-4 rounded-lg">
        {filteredDonors.length > 0 ? (
          <>
            <div className="text-base border-b-2">
              <h1>There Is a Match</h1>
              <div>Recipient Id:{requests.id}</div>
              <div>Donor Info</div>
              <div>Blood Type: {filteredDonors[0]?.bloodType}</div>

              <div>Donor Organ: {filteredDonors[0]?.organType}</div>

              {requests.organ === "Kidney" && (
                <div>HLA: {filteredDonors[0]?.hla}</div>
              )}
            </div>
            {requests.organ !== "Liver" && allMatchedRequests.length > 0 && (
              <div className="text-base">
                <h1>And Matched With</h1>
                <div>Blood Type: {allMatchedRequests[0]?.bloodType}</div>
                <div>Recipient Id: {allMatchedRequests[0]?.id}</div>
                <div>Recipient Organ: {allMatchedRequests[0]?.organ}</div>
              </div>
            )}
          </>
        ) : (
          <div className="text-2xl">
            <p>
              There Is No Match The recipient Will Be Added to the Waiting List
              , According to .
            </p>
            <div>Blood Type: {requests?.bloodType}</div>
            <div>Recipient Number:{filterItem + 1}</div>
          </div>
        )}
      </div>

      {filteredDonors.length > 0 ? (
        <button
          className="bg-[#37F] text-white rounded-lg p-4 w-36 flex justify-center mt-7 mx-auto"
          onClick={addMatch}
        >
          Accept
        </button>
      ) : (
        <button
          className="bg-[#37F] text-white rounded-lg p-4 w-36 flex justify-center mt-7 mx-auto"
          onClick={() => {
            navigate("/overview");
          }}
        >
          Go To Overview
        </button>
      )}

      <ToastContainer />
    </>
  );
}
