import { MdDateRange } from "react-icons/md";
import useGetMatched from "../Hook/useGetMatched";
import { BiUser } from "react-icons/bi";
import { GiInternalOrgan } from "react-icons/gi";
import { BsLink45Deg } from "react-icons/bs";

export default function Matched() {
  const { matched } = useGetMatched();

  let seen = new Set();

  let filteredArr = matched.filter((item) => {
    let k = item.idRecipient;
    if (!seen.has(k)) {
      seen.add(k);
      return true;
    }
    return false;
  });

  return (
    <section className="-mt-9 w-3/4 ml-auto mr-[70px]">
      <>
        <h1 className="text-center font-bold m-7">Matched</h1>
        <div className="overflow-auto">
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
                    Status
                  </span>
                </th>

                <th className="border-b-2 p-4 pb-3">
                  <span className="flex items-center gap-4">
                    <BsLink45Deg className="text-xl" />
                    Family_Contact
                  </span>
                </th>
                <th className="border-b-2 border-r-2 p-4 pb-3">
                  <span className="flex items-center gap-4">
                    <BiUser className="text-xl" />
                    Donor ID
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArr
                .sort((a, b) => new Date(b.matchedAt) - new Date(a.matchedAt))
                .map((val) => (
                  <tr
                    key={val.id * Math.random() * val.idDonor}
                    className="cursor-pointer"
                  >
                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.nameRecipient || val.name}
                    </td>
                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.idRecipient}
                    </td>

                    <td className="border-b-2 border-r-2 p-4 pb-3">Matched</td>
                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.phoneNumberRecipient || val.familyContact}
                    </td>

                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.idDonor}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
    </section>
  );
}
