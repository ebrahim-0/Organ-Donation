/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import { MdDateRange } from "react-icons/md";
import { BiLoader, BiUser } from "react-icons/bi";
import { BsLink45Deg } from "react-icons/bs";
import { GiInternalOrgan } from "react-icons/gi";
import useGetDonor from "../../Hook/useGetDonor";

export default function SearchDonor() {
  const { brainDeathData } = useGetDonor();

  const [search, setSearch] = useState(false);

  const [bloodType, setBloodType] = useState(false);
  const [organ, setOrgan] = useState(false);

  const [result, setResult] = useState([]);

  useEffect(() => {
    if (organ === "All Organs") {
      let filteredByOrganAndBlood = brainDeathData.filter(
        (donor) => donor.bloodType === bloodType,
      );
      setResult(filteredByOrganAndBlood);
    } else {
      let filteredByOrganAndBlood = brainDeathData
        .filter((donor) => donor.bloodType === bloodType)
        .filter((donor) => donor.organType === organ);

      setResult(filteredByOrganAndBlood);
    }
  }, [organ, bloodType, brainDeathData]);

  return (
    <>
      {search ? (
        result.length > 0 ? (
          <div className="w-3/4 ml-auto mr-[70px] overflow-auto">
            <table className="w-full table-auto bg-white rounded-md">
              <thead>
                <tr>
                  <th className="border-b-2 border-r-2 p-4 pb-3">
                    <span className="flex items-center gap-4">
                      <MdDateRange className="text-xl" />
                      Name
                    </span>
                  </th>
                  <th className="border-b-2 border-r-2 p-4 pb-3">
                    <span className="flex items-center gap-4">
                      <BiUser className="text-xl" />
                      ID
                    </span>
                  </th>
                  <th className="border-b-2 border-r-2 p-4 pb-3">
                    <span className="flex items-center gap-4">
                      <GiInternalOrgan className="text-xl" />
                      Organ
                    </span>
                  </th>

                  <th className="border-b-2 border-r-2 p-4 pb-3">
                    <span className="flex items-center gap-4">
                      <BiLoader className="text-xl" />
                      Blood_Type
                    </span>
                  </th>
                  <th className="border-b-2 p-4 pb-3">
                    <span className="flex items-center gap-4">
                      <BsLink45Deg className="text-xl" />
                      HLA
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result
                  .sort((a, b) => b.priority - a.priority)
                  .map((result, i) => (
                    <tr key={i} className="cursor-pointer">
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {result.name}
                      </td>
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {result.id}
                      </td>
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {/* {result.organType.length > 1
                        ? "All Organs"
                        : result.organType} */}
                        {result.organType}
                      </td>

                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {result.bloodType}
                      </td>
                      <td className="border-b-2 border-r-2 p-2 pb-3">
                        {result.hla}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-96 mx-auto">
            No Data Found
          </div>
        )
      ) : (
        <form
          className="flex flex-col gap-20 w-[300px] md:w-[500px] mx-auto"
          onSubmit={() => {
            setSearch(true);
          }}
        >
          <label className="flex justify-between">
            Blood_Type:
            <select
              defaultValue={"Blood Type"}
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) => setBloodType(e.target.value)}
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
          <label className="flex justify-between">
            Organ:
            <select
              defaultValue={"Organ Type"}
              className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
              onChange={(e) => setOrgan(e.target.value)}
            >
              <option disabled value={"Organ Type"}>
                Organ Type
              </option>
              <option value={"All Organs"}>All Organs</option>
              <option value={"Kidney"}>Kidney</option>
              <option value={"Liver"}>Liver</option>
            </select>
          </label>
          <button
            disabled={!bloodType || !organ ? true : false}
            className="py-2 px-12 w-fit mx-auto bg-[#0F58B6] text-slate-50 rounded-[10px]"
          >
            Search
          </button>
        </form>
      )}
    </>
  );
}
