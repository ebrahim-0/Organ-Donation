import { useSelector } from "noval";
import useMatchedDonor from "../../Hook/useMatchedDonor";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../auth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RunAlgorithm() {
  const navigate = useNavigate();

  const [donor] = useSelector(["donor"]);

  const {
    filteredRecipients,
    filteredRecipientsAllOrgans,
    filteredRecipientsKidney,
    filteredRecipientsLiver,
  } = useMatchedDonor(donor);

  const match = async () => {
    try {
      const colRef = collection(db, "matched");

      if (donor.organ === "All Organs") {
        if (filteredRecipientsAllOrgans.length > 0) {
          await addDoc(colRef, {
            ...donor,
            idDonor: donor.id,
            nameRecipient: filteredRecipientsAllOrgans[0]?.name,
            birthDateRecipient: filteredRecipientsAllOrgans[0]?.birthDate,
            idRecipient: filteredRecipientsAllOrgans[0]?.id,
            organTypeRecipient: filteredRecipientsAllOrgans[0]?.organ,
            bloodTypeRecipient: filteredRecipientsAllOrgans[0]?.bloodType,
            phoneNumberRecipient:
              filteredRecipientsAllOrgans[0]?.phoneNumber || "",
            matchedAt: new Date().toLocaleString(),
            add: 1,
          });

          await deleteDoc(
            doc(db, "requestorgan", filteredRecipientsAllOrgans[0].unique),
          );
        }

        if (
          filteredRecipientsLiver.length > 0 &&
          filteredRecipientsAllOrgans.length === 0
        ) {
          await addDoc(colRef, {
            ...donor,
            idDonor: donor.id,
            nameRecipient: filteredRecipientsLiver[0]?.name,
            birthDateRecipient: filteredRecipientsLiver[0]?.birthDate,
            idRecipient: filteredRecipientsLiver[0]?.id,
            organTypeRecipient: filteredRecipientsLiver[0]?.organ,
            bloodTypeRecipient: filteredRecipientsLiver[0]?.bloodType,
            phoneNumberRecipient: filteredRecipientsLiver[0]?.phoneNumber || "",
            matchedAt: new Date().toLocaleString(),
            add: 5,
          });

          await deleteDoc(
            doc(db, "requestorgan", filteredRecipientsLiver[0].unique),
          );

          if (filteredRecipientsKidney.length === 0) {
            await deleteDoc(doc(db, "reportbraindeath", donor.unique));
            await deleteDoc(doc(db, "notification", donor.notiId));
          } else {
            await addDoc(colRef, {
              ...donor,
              idDonor: donor.id,
              nameRecipient: filteredRecipientsKidney[0]?.name,
              birthDateRecipient: filteredRecipientsKidney[0]?.birthDate,
              idRecipient: filteredRecipientsKidney[0]?.id,
              organTypeRecipient: filteredRecipientsKidney[0]?.organ,
              bloodTypeRecipient: filteredRecipientsKidney[0]?.bloodType,
              phoneNumberRecipient:
                filteredRecipientsKidney[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
              add: 3,
            });

            await deleteDoc(
              doc(db, "requestorgan", filteredRecipientsKidney[0].unique),
            );

            await deleteDoc(doc(db, "reportbraindeath", donor.unique));

            await deleteDoc(doc(db, "notification", donor.notiId));
          }
        }

        if (
          filteredRecipientsKidney.length > 0 &&
          filteredRecipientsAllOrgans.length === 0
        ) {
          await addDoc(colRef, {
            ...donor,
            idDonor: donor.id,
            nameRecipient: filteredRecipientsKidney[0]?.name,
            birthDateRecipient: filteredRecipientsKidney[0]?.birthDate,
            idRecipient: filteredRecipientsKidney[0]?.id,
            organTypeRecipient: filteredRecipientsKidney[0]?.organ,
            bloodTypeRecipient: filteredRecipientsKidney[0]?.bloodType,
            phoneNumberRecipient:
              filteredRecipientsKidney[0]?.phoneNumber || "",
            matchedAt: new Date().toLocaleString(),
            add: 66,
            test1: "055",
          });

          await deleteDoc(
            doc(db, "requestorgan", filteredRecipientsKidney[0].unique),
          );

          if (filteredRecipientsLiver.length === 0) {
            await deleteDoc(doc(db, "reportbraindeath", donor.unique));
            await deleteDoc(doc(db, "notification", donor.notiId));
          } else {
            await addDoc(colRef, {
              ...donor,
              idDonor: donor.id,
              nameRecipient: filteredRecipientsLiver[0]?.name,
              birthDateRecipient: filteredRecipientsLiver[0]?.birthDate,
              idRecipient: filteredRecipientsLiver[0]?.id,
              organTypeRecipient: filteredRecipientsLiver[0]?.organ,
              bloodTypeRecipient: filteredRecipientsLiver[0]?.bloodType,
              phoneNumberRecipient:
                filteredRecipientsLiver[0]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
              add: 5,
            });

            await deleteDoc(
              doc(db, "requestorgan", filteredRecipientsLiver[0].unique),
            );

            await deleteDoc(doc(db, "reportbraindeath", donor.unique));

            await deleteDoc(doc(db, "notification", donor.notiId));
          }
        }

        if (filteredRecipientsKidney.length >= 2) {
          await addDoc(colRef, {
            ...donor,
            idDonor: donor.id,
            nameRecipient: filteredRecipientsKidney[1]?.name,
            birthDateRecipient: filteredRecipientsKidney[1]?.birthDate,
            idRecipient: filteredRecipientsKidney[1]?.id,
            organTypeRecipient: filteredRecipientsKidney[1]?.organ,
            bloodTypeRecipient: filteredRecipientsKidney[1]?.bloodType,
            phoneNumberRecipient:
              filteredRecipientsKidney[1]?.phoneNumber || "",
            matchedAt: new Date().toLocaleString(),
            add: 6,
          });

          await deleteDoc(
            doc(db, "requestorgan", filteredRecipientsKidney[1].unique),
          );
        } else {
          await deleteDoc(doc(db, "reportbraindeath", donor.unique));

          await deleteDoc(doc(db, "notification", donor.notiId));
        }

        toast.success("The Recipient(s) Registered Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/overview");
        }, 2000);
      } else if (donor.organ === "Liver") {
        await addDoc(colRef, {
          ...donor,
          idDonor: donor.id,
          nameRecipient: filteredRecipientsLiver[0]?.name,
          birthDateRecipient: filteredRecipientsLiver[0]?.birthDate,
          idRecipient: filteredRecipientsLiver[0]?.id,
          organTypeRecipient: filteredRecipientsLiver[0]?.organ,
          bloodTypeRecipient: filteredRecipientsLiver[0]?.bloodType,
          phoneNumberRecipient: filteredRecipientsLiver[0]?.phoneNumber || "",
          matchedAt: new Date().toLocaleString(),
          add: 7,
        });

        await deleteDoc(
          doc(db, "requestorgan", filteredRecipientsLiver[0].unique),
        );

        await deleteDoc(doc(db, "reportbraindeath", donor.unique));

        await deleteDoc(doc(db, "notification", donor.notiId));

        toast.success("The Recipient(s) Registered Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/overview");
        }, 2000);
      } else if (donor.organ === "Kidney") {
        console.log("hi in kidney");

        await addDoc(colRef, {
          ...donor,
          idDonor: donor.id,
          nameRecipient: filteredRecipientsKidney[0]?.name,
          birthDateRecipient: filteredRecipientsKidney[0]?.birthDate,
          idRecipient: filteredRecipientsKidney[0]?.id,
          organTypeRecipient: filteredRecipientsKidney[0]?.organ,
          bloodTypeRecipient: filteredRecipientsKidney[0]?.bloodType,
          phoneNumberRecipient: filteredRecipientsKidney[0]?.phoneNumber || "",
          matchedAt: new Date().toLocaleString(),
          add: 8,
        });

        if (donor.donateKidney === 1) {
          await deleteDoc(doc(db, "reportbraindeath", donor.unique));
          await deleteDoc(doc(db, "notification", donor.notiId));
        } else {
          if (filteredRecipientsKidney.length >= 2) {
            await addDoc(colRef, {
              ...donor,
              idDonor: donor.id,
              nameRecipient: filteredRecipientsKidney[1]?.name,
              birthDateRecipient: filteredRecipientsKidney[1]?.birthDate,
              idRecipient: filteredRecipientsKidney[1]?.id,
              organTypeRecipient: filteredRecipientsKidney[1]?.organ,
              bloodTypeRecipient: filteredRecipientsKidney[1]?.bloodType,
              phoneNumberRecipient:
                filteredRecipientsKidney[1]?.phoneNumber || "",
              matchedAt: new Date().toLocaleString(),
              add: 6,
            });

            await deleteDoc(
              doc(db, "requestorgan", filteredRecipientsKidney[1].unique),
            );

            await deleteDoc(doc(db, "reportbraindeath", donor.unique));
            await deleteDoc(doc(db, "notification", donor.notiId));
          } else {
            await deleteDoc(doc(db, "reportbraindeath", donor.unique));

            await deleteDoc(doc(db, "notification", donor.notiId));
          }
        }

        await deleteDoc(
          doc(db, "requestorgan", filteredRecipientsKidney[0].unique),
        );

        toast.success("The Recipient(s) Registered Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/overview");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="-mt-9 w-3/4 ml-auto mr-[70px]">
      <div className="flex items-start justify-center flex-col border-2 border-[#37F] bg-[#FFF] w-[486px] h-[320px] mx-auto p-4 rounded-lg">
        {donor.organ === "All Organs" && (
          <>
            {filteredRecipientsAllOrgans.length > 0 && (
              <>
                <div
                  className={
                    "text-sm border-b-[3px] last:border-b-0 w-full relative"
                  }
                >
                  <h1>
                    Recipient Info
                    {" ,"}
                    <span>Donor Id {donor.id}</span>
                    {" ,"}
                    <span>
                      Recipient Id {filteredRecipientsAllOrgans[0].id}
                    </span>
                  </h1>
                  <span>
                    Blood Type :{filteredRecipientsAllOrgans[0].bloodType}
                  </span>
                  {"  "}
                  <span>Organ :{filteredRecipientsAllOrgans[0].organ}</span>
                  {"  "}
                  <span>HLA :{filteredRecipientsAllOrgans[0].hla}</span>
                  {"  "}
                  <p>
                    need other organs? :{" "}
                    {filteredRecipientsAllOrgans[0].moreTanOrgan}
                  </p>
                  <p>
                    Does the patient on dialysis? :
                    {filteredRecipientsAllOrgans[0].dialysis || "NO"}
                  </p>
                  <p>
                    Does the patient have dialysis type 1? :
                    {filteredRecipientsAllOrgans[0].diabetesTypeOne || "NO"}
                  </p>
                  <p
                    className={
                      "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                    }
                  >
                    Matched
                  </p>
                </div>
                {filteredRecipientsKidney.length > 0 && (
                  <div
                    className={
                      "text-sm border-b-[3px] last:border-b-0 w-full relative"
                    }
                  >
                    <h1>
                      Recipient Info
                      {" ,"}
                      <span>Donor Id {donor.id}</span>
                      {" ,"}
                      <span>Recipient Id {filteredRecipientsKidney[0].id}</span>
                    </h1>
                    <span>
                      Blood Type :{filteredRecipientsKidney[0].bloodType}
                    </span>
                    {"  "}
                    <span>Organ :{filteredRecipientsKidney[0].organ}</span>
                    {"  "}
                    <span>HLA :{filteredRecipientsKidney[0].hla}</span>
                    {"  "}
                    <p>
                      need other organs? :{" "}
                      {filteredRecipientsKidney[0].moreTanOrgan}
                    </p>
                    <p>
                      Does the patient on dialysis? :
                      {filteredRecipientsKidney[0].dialysis || "NO"}
                    </p>
                    <p>
                      Does the patient have dialysis type 1? :
                      {filteredRecipientsKidney[0].diabetesTypeOne || "NO"}
                    </p>
                    <p
                      className={
                        "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                      }
                    >
                      Matched
                    </p>
                  </div>
                )}
              </>
            )}
            {filteredRecipientsKidney.length > 0 &&
              filteredRecipientsAllOrgans.length === 0 && (
                <>
                  <div
                    className={
                      "text-sm border-b-[3px] last:border-b-0 w-full relative"
                    }
                  >
                    <h1>
                      Recipient Info
                      {" ,"}
                      <span>Donor Id {donor.id}</span>
                      {" ,"}
                      <span>Recipient Id {filteredRecipientsKidney[0].id}</span>
                    </h1>
                    <span>
                      Blood Type :{filteredRecipientsKidney[0].bloodType}
                    </span>
                    {"  "}
                    <span>Organ :{filteredRecipientsKidney[0].organ}</span>
                    {"  "}
                    <span>HLA :{filteredRecipientsKidney[0].hla}</span>
                    {"  "}
                    <p>
                      need other organs? :{" "}
                      {filteredRecipientsKidney[0].moreTanOrgan}
                    </p>
                    <p>
                      Does the patient on dialysis? :
                      {filteredRecipientsKidney[0].dialysis || "NO"}
                    </p>
                    <p>
                      Does the patient have dialysis type 1? :
                      {filteredRecipientsKidney[0].diabetesTypeOne || "NO"}
                    </p>
                    <p
                      className={
                        "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                      }
                    >
                      Matched
                    </p>
                  </div>
                  {filteredRecipientsKidney.length === 2 && (
                    <div
                      className={
                        "text-sm border-b-[3px] last:border-b-0 w-full relative"
                      }
                    >
                      <h1>
                        Recipient Info
                        {" ,"}
                        <span>Donor Id {donor.id}</span>
                        {" ,"}
                        <span>
                          Recipient Id {filteredRecipientsKidney[1].id}
                        </span>
                      </h1>
                      <span>
                        Blood Type :{filteredRecipientsKidney[1].bloodType}
                      </span>
                      {"  "}
                      <span>Organ :{filteredRecipientsKidney[1].organ}</span>
                      {"  "}
                      <span>HLA :{filteredRecipientsKidney[1].hla}</span>
                      {"  "}
                      <p>
                        need other organs? :{" "}
                        {filteredRecipientsKidney[1].moreTanOrgan}
                      </p>
                      <p>
                        Does the patient on dialysis? :
                        {filteredRecipientsKidney[1].dialysis || "NO"}
                      </p>
                      <p>
                        Does the patient have dialysis type 1? :
                        {filteredRecipientsKidney[1].diabetesTypeOne || "NO"}
                      </p>
                      <p
                        className={
                          "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                        }
                      >
                        Matched
                      </p>
                    </div>
                  )}
                </>
              )}

            {filteredRecipientsLiver.length > 0 &&
              filteredRecipientsAllOrgans.length === 0 && (
                <div
                  className={
                    "text-sm border-b-[3px] last:border-b-0 w-full relative"
                  }
                >
                  <h1>
                    Recipient Info
                    {" ,"}
                    <span>Donor Id {donor.id}</span>
                    {" ,"}
                    <span>Recipient Id {filteredRecipientsLiver[0].id}</span>
                  </h1>
                  <span>
                    Blood Type : {filteredRecipientsLiver[0].bloodType}
                  </span>{" "}
                  <span>Organ :{filteredRecipientsLiver[0].organ}</span>{" "}
                  <span>
                    MELD :
                    {filteredRecipientsLiver[0].meldScore ||
                      filteredRecipientsLiver[0].hla}
                  </span>{" "}
                  <p>
                    Does the patient have cancer? :
                    {filteredRecipientsLiver[0].cancer || "NO"}
                  </p>
                  <p
                    className={
                      "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                    }
                  >
                    Matched
                  </p>
                </div>
              )}
          </>
        )}
        {donor.organ === "Kidney" && filteredRecipientsKidney.length > 0 && (
          <>
            <div
              className={
                "text-sm border-b-[3px] last:border-b-0 w-full relative"
              }
            >
              <h1>
                Recipient Info
                {" ,"}
                <span>Donor Id {donor.id}</span>
                {" ,"}
                <span>Recipient Id {filteredRecipientsKidney[0].id}</span>
              </h1>
              <span>Blood Type :{filteredRecipientsKidney[0].bloodType}</span>
              {"  "}
              <span>Organ :{filteredRecipientsKidney[0].organ}</span>
              {"  "}
              <span>HLA :{filteredRecipientsKidney[0].hla}</span>
              {"  "}
              <p>
                need other organs? : {filteredRecipientsKidney[0].moreTanOrgan}
              </p>
              <p>
                Does the patient on dialysis? :
                {filteredRecipientsKidney[0].dialysis || "NO"}
              </p>
              <p>
                Does the patient have dialysis type 1? :
                {filteredRecipientsKidney[0].diabetesTypeOne || "NO"}
              </p>
              <p
                className={
                  "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                }
              >
                Matched
              </p>
            </div>

            {filteredRecipientsKidney.length >= 2 &&
              donor.donateKidney !== 1 && (
                <div
                  className={
                    "text-sm border-b-[3px] last:border-b-0 w-full relative"
                  }
                >
                  <h1>
                    Recipient Info
                    {" ,"}
                    <span>Donor Id {donor.id}</span>
                    {" ,"}
                    <span>Recipient Id {filteredRecipientsKidney[1].id}</span>
                  </h1>
                  <span>
                    Blood Type :{filteredRecipientsKidney[1].bloodType}
                  </span>
                  {"  "}
                  <span>Organ :{filteredRecipientsKidney[1].organ}</span>
                  {"  "}
                  <span>HLA :{filteredRecipientsKidney[1].hla}</span>
                  {"  "}
                  <p>
                    need other organs? :{" "}
                    {filteredRecipientsKidney[1].moreTanOrgan}
                  </p>
                  <p>
                    Does the patient on dialysis? :
                    {filteredRecipientsKidney[1].dialysis || "NO"}
                  </p>
                  <p>
                    Does the patient have dialysis type 1? :
                    {filteredRecipientsKidney[1].diabetesTypeOne || "NO"}
                  </p>
                  <p
                    className={
                      "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                    }
                  >
                    Matched
                  </p>
                </div>
              )}
          </>
        )}
        {donor.organ === "Liver" && filteredRecipientsLiver.length > 0 && (
          <>
            <div
              className={
                "text-sm border-b-[3px] last:border-b-0 w-full relative"
              }
            >
              <h1>
                Recipient Info
                {" ,"}
                <span>Donor Id {donor.id}</span>
                {" ,"}
                <span>Recipient Id {filteredRecipientsLiver[0].id}</span>
              </h1>
              <span>Blood Type : {filteredRecipientsLiver[0].bloodType}</span>{" "}
              <span>Organ :{filteredRecipientsLiver[0].organ}</span>{" "}
              <span>
                MELD :
                {filteredRecipientsLiver[0].meldScore ||
                  filteredRecipientsLiver[0].hla}
              </span>{" "}
              <p>
                Does the patient have cancer? :
                {filteredRecipientsLiver[0].cancer || "NO"}
              </p>
              <p
                className={
                  "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                }
              >
                Matched
              </p>
            </div>
          </>
        )}
      </div>
      <button
        onClick={() => {
          match();
        }}
        className="bg-[#37F] text-white rounded-lg p-4 w-36 flex justify-center mt-7 mx-auto"
      >
        Accept
      </button>
      <ToastContainer />
    </section>
  );
}

/*


        {filteredRecipients.length > 0 && (
          <>
            {filteredRecipientsKidney.length >= 2 && (
              <>
                <div
                  className={
                    "text-sm border-b-[3px] last:border-b-0 w-full relative"
                  }
                >
                  <h1>
                    Recipient Info
                    {" ,"}
                    <span>Donor Id {donor.id}</span>
                    {" ,"}
                    <span>Recipient Id {filteredRecipientsKidney[0].id}</span>
                  </h1>
                  <span>
                    Blood Type :{filteredRecipientsKidney[0].bloodType}
                  </span>
                  {"  "}
                  <span>Organ :{filteredRecipientsKidney[0].organ}</span>
                  {"  "}
                  <span>HLA :{filteredRecipientsKidney[0].hla}</span>
                  {"  "}
                  <p>
                    need other organs? :{" "}
                    {filteredRecipientsKidney[0].moreTanOrgan}
                  </p>
                  <p>
                    Does the patient on dialysis? :
                    {filteredRecipientsKidney[0].dialysis || "NO"}
                  </p>
                  <p>
                    Does the patient have dialysis type 1? :
                    {filteredRecipientsKidney[0].diabetesTypeOne || "NO"}
                  </p>
                  <p
                    className={
                      "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                    }
                  >
                    Matched
                  </p>
                </div>
                {donor.organ !== "Kidney" && (
                  <div
                    className={
                      "text-sm border-b-[3px] last:border-b-0 w-full relative"
                    }
                  >
                    <h1>
                      Recipient Info
                      {" ,"}
                      <span>Donor Id {donor.id}</span>
                      {" ,"}
                      <span>Recipient Id {filteredRecipientsKidney[1].id}</span>
                    </h1>
                    <span>
                      Blood Type :{filteredRecipientsKidney[1].bloodType}
                    </span>
                    {"  "}
                    <span>Organ :{filteredRecipientsKidney[1].organ}</span>
                    {"  "}
                    <span>HLA :{filteredRecipientsKidney[1].hla}</span>
                    {"  "}
                    <p>
                      need other organs? :{" "}
                      {filteredRecipientsKidney[1].moreTanOrgan}
                    </p>
                    <p>
                      Does the patient on dialysis? :
                      {filteredRecipientsKidney[1].dialysis || "NO"}
                    </p>
                    <p>
                      Does the patient have dialysis type 1? :
                      {filteredRecipientsKidney[1].diabetesTypeOne || "NO"}
                    </p>
                    <p
                      className={
                        "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                      }
                    >
                      Matched
                    </p>
                  </div>
                )}
              </>
            )}
            {filteredRecipientsKidney.length === 1 && (
              <>
                <div
                  className={
                    "text-sm border-b-[3px] last:border-b-0 w-full relative"
                  }
                >
                  <h1>
                    Recipient Info
                    {" ,"}
                    <span>Donor Id {donor.id}</span>
                    {" ,"}
                    <span>Recipient Id {filteredRecipientsKidney[0].id}</span>
                  </h1>
                  <span>
                    Blood Type :{filteredRecipientsKidney[0].bloodType}
                  </span>
                  {"  "}
                  <span>Organ :{filteredRecipientsKidney[0].organ}</span>
                  {"  "}
                  <span>HLA :{filteredRecipientsKidney[0].hla}</span>
                  {"  "}
                  <p>
                    need other organs? :{" "}
                    {filteredRecipientsKidney[0].moreTanOrgan}
                  </p>
                  <p>
                    Does the patient on dialysis? :
                    {filteredRecipientsKidney[0].dialysis || "NO"}
                  </p>
                  <p>
                    Does the patient have dialysis type 1? :
                    {filteredRecipientsKidney[0].diabetesTypeOne || "NO"}
                  </p>
                  <p
                    className={
                      "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                    }
                  >
                    Matched
                  </p>
                </div>
              </>
            )}

            {filteredRecipientsLiver.length > 0 && (
              <div
                className={
                  "text-sm border-b-[3px] last:border-b-0 w-full relative"
                }
              >
                <h1>
                  Recipient Info
                  {" ,"}
                  <span>Donor Id {donor.id}</span>
                  {" ,"}
                  <span>Recipient Id {filteredRecipientsLiver[0].id}</span>
                </h1>
                <span>Blood Type : {filteredRecipientsLiver[0].bloodType}</span>{" "}
                <span>Organ :{filteredRecipientsLiver[0].organ}</span>{" "}
                <span>
                  MELD :
                  {filteredRecipientsLiver[0].meldScore ||
                    filteredRecipientsLiver[0].hla}
                </span>{" "}
                <p>
                  Does the patient have cancer? :
                  {filteredRecipientsLiver[0].cancer || "NO"}
                </p>
                <p
                  className={
                    "absolute top-1/2 transform -translate-y-1/2 right-0 text-green-600 text-lg"
                  }
                >
                  Matched
                </p>
              </div>
            )}
          </>
        )}


 */
