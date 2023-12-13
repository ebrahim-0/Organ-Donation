import useGetDonor from "./useGetDonor";

export default function useMatchedRequests(recipient) {
  const { brainDeathData } = useGetDonor();

  // Corrected array of allowed blood types for each recipient blood type
  const allowedBloodTypes = {
    O: ["O"], // O can only receive from O
    A: ["A", "O"], // A can receive from A and O
    B: ["B", "O"], // B can receive from B and O
    AB: ["A", "B", "AB", "O"], // AB can receive from any blood type
  };

  // Extract unique blood types from brainDeathData and recipient
  const recipientBloodType = recipient.bloodType;

  // Filter donors based on allowed blood types for the recipient
  let filteredDonors = brainDeathData.filter(
    (donor) =>
      allowedBloodTypes[recipientBloodType].includes(donor.bloodType) &&
      (donor.organType === recipient.organ || donor.organType === "All Organs"),
  );

  // Additional filtering for kidney recipients based on HLA compatibility
  if (recipient.organ === "Kidney" && recipient.hla) {
    filteredDonors = filteredDonors.filter(
      (donor) => donor.hla === recipient.hla,
    );
  }

  // Sort donors based on priority and return the result
  filteredDonors.sort((a, b) => b.priority - a.priority);

  const filteredAllDonors = filteredDonors.filter(
    (donor) => donor.organType === "All Organs",
  );

  const filteredAllDonorsKidney = filteredDonors.filter(
    (donor) => donor.organ === "Kidney",
  );

  const filteredAllDonorsLiver = filteredDonors.filter(
    (donor) => donor.organ === "Liver",
  );

  return {
    filteredDonors,
    filteredAllDonors,
    filteredAllDonorsKidney,
    filteredAllDonorsLiver,
  };
}
