import { MdDateRange } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { BsLink45Deg } from "react-icons/bs";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useGetRequests from "../../Hook/useGetRequests";

export default function ViewMatchedCases() {
  const [isOrgan, setIsOrgan] = useState(false);
  const [organ, setOrgan] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [filteredRecipients, setFilteredRecipients] = useState("");

  const { requests } = useGetRequests();

  const filterObjectsById = (arr) => {
    const uniqueIds = new Set();
    return arr.filter((obj) => {
      if (!uniqueIds.has(obj.id)) {
        uniqueIds.add(obj.id);
        return true;
      }
      return false;
    });
  };

  const filteredRequests = filterObjectsById(requests);

  useEffect(() => {
    if (organ === "All Organs") {
      setFilteredRecipients(
        filteredRequests
          .filter(
            (val) => val.bloodType === bloodType && val.organ === "All Organs",
          )

          .sort(
            (a, b) =>
              new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
          ),
      );
    } else {
      setFilteredRecipients(
        requests
          .filter((val) => val.organ === organ && val.bloodType === bloodType)
          .sort(
            (a, b) =>
              new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
          ),
      );
    }
  }, [organ]);

  return (
    <section className="w-3/4 mx-auto ml-auto mr-[70px] overflow-auto">
      {isOrgan ? (
        <>
          {filteredRecipients.length > 0 ? (
            <>
              <h1 className="text-center font-bold m-7">Waiting List</h1>
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
                          <BiUser className="text-xl" />
                          Organ Type
                        </span>
                      </th>

                      <th className="border-b-2 p-4 pb-3">
                        <span className="flex items-center gap-4">
                          <BsLink45Deg className="text-xl" />
                          Family_Contact
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecipients
                      .sort((a, b) => {
                        if (b.priority === a.priority) {
                          return new Date(a.createAt) - new Date(b.createAt);
                        }
                        return b.priority - a.priority;
                      })
                      .map((result, i) => (
                        <tr key={i} className="cursor-pointer">
                          <td className="border-b-2 border-r-2 p-4 pb-3">
                            {result.name}
                          </td>
                          <td className="border-b-2 border-r-2 p-4 pb-3">
                            {result.id}
                          </td>

                          <td className="border-b-2 border-r-2 p-4 pb-3">
                            {result.organ}
                          </td>

                          <td className="border-b-2 border-r-2 p-4 pb-3">
                            {result.familyContact}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <h1 className="text-center font-bold m-7">No Waiting List Cases</h1>
          )}
        </>
      ) : (
        <form
          className="flex flex-col gap-20 w-[300px] md:w-[500px] mx-auto"
          onSubmit={() => {
            setIsOrgan(true);
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
      <ToastContainer />
    </section>
  );
}
