import useGetDonor from "./useGetDonor";
import useGetRequests from "./useGetRequests";

export default function useFilterMatched(organ) {
  const { brainDeathData } = useGetDonor();
  const { requests } = useGetRequests();

  const recipientsOneOrgan = requests.filter(
    (recipient) => recipient.organ === organ,
  );

  // Create an array of allowed blood types for each blood type
  const allowedBloodTypes = {
    O: ["A", "B", "AB", "O"], // O can match with any blood type
    A: ["A", "AB"], // A can match with A and AB
    B: ["B", "AB"], // B can match with B and AB
    AB: ["AB"], // AB can only match with AB
  };

  // Extract unique blood types from brainDeathData and recipients
  const donorBloodTypes = brainDeathData.map((donor) => donor.bloodType);
  const recipientBloodTypes = requests.map((recipient) => recipient.bloodType);

  // Find common blood types using Set intersection based on allowed blood types
  const commonBloodTypesSet = new Set(
    donorBloodTypes.filter((donorType) =>
      recipientBloodTypes.some((recipientType) =>
        allowedBloodTypes[donorType].includes(recipientType),
      ),
    ),
  );

  // Convert Set back to an array
  const commonBloodTypesArray = Array.from(commonBloodTypesSet);

  // Filter requests based on common blood types
  let filteredRecipients = requests.filter((request) =>
    commonBloodTypesArray.includes(request.bloodType),
  );

  // filteredRequests now contains the requests that can be fulfilled by the available donors with allowed blood types in brainDeathData.

  // Filter donors and recipients based on common blood types
  let filteredDonors = brainDeathData.filter((donor) =>
    commonBloodTypesArray.includes(donor.bloodType),
  );

  // Filter further by organ
  filteredDonors = filteredDonors.filter((donor) =>
    donor.organType === "All Organs" ? donor : donor.organType === organ,
  );

  filteredRecipients = filteredRecipients.filter((recipient) =>
    recipient.organ.includes(organ),
  );

  if (organ === "Kidney") {
    // For Kidney, filter by HLA in addition to blood type
    const donorHLAs = brainDeathData.map((donor) => donor.hla);

    const recipientHLAs = recipientsOneOrgan.map((recipient) => recipient.hla);

    // Find common HLAs using Set intersection
    const commonHLAsSet = new Set(
      donorHLAs.filter((hla) => recipientHLAs.includes(hla)),
    );

    // Convert Set back to an array
    const commonHLAsArray = Array.from(commonHLAsSet);

    // Further filter donors and recipients based on common HLAs
    filteredDonors = filteredDonors.filter((donor) =>
      commonHLAsArray.includes(donor.hla),
    );

    filteredRecipients = filteredRecipients.filter((recipient) =>
      commonHLAsArray.includes(recipient.hla),
    );

    filteredRecipients = filteredRecipients
      .sort((a, b) => b.priority - a.priority)
      .sort(
        (a, b) =>
          new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime(),
      );
  }

  if (organ === "Liver") {
    filteredRecipients = filteredRecipients.sort(
      (a, b) => b.priority - a.priority,
    );
  }

  return { filteredDonors, filteredRecipients };
}
