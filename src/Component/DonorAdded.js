import { useDispatch, useSelector } from "noval";
import useMatchedDonor from "../Hook/useMatchedDonor";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useGetNotification from "../Hook/useGetNotification";
import { useEffect, useState } from "react";

export default function DonorAdded() {
  const { notification } = useGetNotification();

  const [newNotification, setNewNotification] = useState(0);

  const { dispatch } = useDispatch();

  useEffect(() => {
    const filterItem = notification.filter((val) => val.new === true).length;

    setNewNotification(filterItem);

    dispatch({ filterItem }, "newNotification");
  }, [notification]);

  const navigate = useNavigate();

  const [donor] = useSelector(["donor"]);
  const {
    filteredRecipientsAllOrgans,
    filteredRecipientsKidney,
    filteredRecipientsLiver,
  } = useMatchedDonor(donor);

  const addMatch = async () => {
    navigate("/runalgorithm");
  };

  let filteredRecipients = [];

  if (filteredRecipientsAllOrgans.length > 0) {
    filteredRecipients = filteredRecipientsAllOrgans;
  } else {
    if (filteredRecipientsKidney.length > 0) {
      filteredRecipients = filteredRecipientsKidney;
    } else {
      filteredRecipients = filteredRecipientsLiver;
    }
  }

  return (
    <>
      <div className="flex items-start justify-center flex-col border-2 border-[#37F] bg-[#FFF] w-[486px] h-[309px] mx-auto p-4 rounded-lg">
        {filteredRecipients.length > 0 ? (
          <div className="text-3xl">
            <div>Match With #{filteredRecipients.length} of Recipient</div>
            <span>Donor Info</span>
            <h1>Blood Type :{donor.bloodType}</h1>
            <h1>Organ Type :{donor.organType}</h1>
            {donor.hla && <h1>HLA : {donor.hla}</h1>}
          </div>
        ) : (
          <div className="text-3xl">
            <div>Did not Match With any Recipient</div>
            <span>Donor Info</span>
            <h1>Blood Type :{donor.bloodType}</h1>
            <h1>Blood Type :{donor.organType}</h1>
            {donor.hla && <h1>HLA : {donor.hla}</h1>}
          </div>
        )}
        <ToastContainer />
      </div>
      {filteredRecipients.length > 0 ? (
        <button
          className="bg-[#37F] text-white rounded-lg p-4 w-36 flex justify-center mt-7 mx-auto"
          onClick={addMatch}
        >
          Run Algorithm
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
    </>
  );
}
