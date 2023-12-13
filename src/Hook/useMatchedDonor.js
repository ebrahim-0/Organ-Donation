import useGetRequests from "./useGetRequests";

export default function useMatchedDonor(donor) {
  const { requests } = useGetRequests();

  // Donor with blood type O can donate to all types, other types have restrictions
  const allowedBloodTypesForDonor = {
    O: ["A", "B", "AB", "O"], // O can donate to any blood type
    A: ["A", "AB"], // A can donate to A and AB
    B: ["B", "AB"], // B can donate to B and AB
    AB: ["AB"], // AB can only donate to AB
  };

  // Get this donor's allowed recipient blood types
  const donorAllowedRecipientBloodTypes =
    allowedBloodTypesForDonor[donor.bloodType];

  // Filter requests based on common blood types and organ
  let filteredRecipients = requests.filter(
    (recipient) =>
      donorAllowedRecipientBloodTypes.includes(recipient.bloodType) &&
      (donor.organType === "All Organs" || donor.organType === recipient.organ),
  );

  // Further filter for kidney recipients by HLA matching, if donor's organ is a kidney
  if (donor.hla && donor.organType === "Kidney") {
    filteredRecipients = filteredRecipients.filter(
      (recipient) => recipient.hla === donor.hla,
    );
  }

  // Sort the filtered recipients by priority
  filteredRecipients.sort((a, b) => b.priority - a.priority);

  // Sort filtered recipients based on priority
  const sortedRecipients = filteredRecipients.sort(
    (a, b) => b.priority - a.priority,
  );

  // Separate filtered recipients by organ type
  const filteredRecipientsKidney = sortedRecipients
    .filter((recipient) => recipient.organ === "Kidney")
    .filter((recipient) => recipient.hla === donor.hla);

  const filteredRecipientsLiver = sortedRecipients.filter(
    (recipient) => recipient.organ === "Liver",
  );

  const filteredRecipientsAllOrgans = sortedRecipients.filter(
    (recipient) => recipient.organ === "All Organs",
  );

  return {
    filteredRecipients: sortedRecipients,
    filteredRecipientsAllOrgans,
    filteredRecipientsKidney,
    filteredRecipientsLiver,
  };
}
