/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import * as echarts from "echarts";
import { useEffect, useMemo, useState } from "react";
import useGetDonor from "../Hook/useGetDonor";
import useGetRequests from "../Hook/useGetRequests";
import useGetMatched from "../Hook/useGetMatched";
import useFilterMatched from "../Hook/useFilterMatched";
import useGetNotification from "../Hook/useGetNotification";
import { useDispatch } from "noval";
import useGetRole from "../Hook/useGetRole";

export default function OverView() {
  const { brainDeathData } = useGetDonor();
  const { requests } = useGetRequests();

  const { matched } = useGetMatched();

  const { role } = useGetRole();

  const {
    filteredDonors: filteredDonorsKidney,
    filteredRecipients: filteredRecipientsKidney,
  } = useFilterMatched("Kidney");
  const {
    filteredDonors: filteredDonorsLiver,
    filteredRecipients: filteredRecipientsLiver,
  } = useFilterMatched("Liver");

  const { notification } = useGetNotification();

  const [newNotification, setNewNotification] = useState(0);

  const { dispatch } = useDispatch();

  useEffect(() => {
    const filterItem = notification.filter((val) => val.new === true).length;

    setNewNotification(filterItem);

    dispatch({ filterItem }, "newNotification");
  }, [notification]);

  var option = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        left: "center",
      },
      series: [
        {
          name: "OverView",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data:
            role === "Transplant Coordinator"
              ? [
                  { value: brainDeathData.length, name: "Brain Death on List" },
                  { value: requests.length, name: "Recipients on List" },
                  { value: matched.length, name: "Transplant" },
                  {
                    value:
                      filteredRecipientsKidney.length +
                      filteredRecipientsLiver.length,
                    name: "Matched Cases",
                  },
                ]
              : [
                  { value: brainDeathData.length, name: "Brain Death on List" },
                  {
                    value:
                      filteredRecipientsKidney.length +
                      filteredRecipientsLiver.length,
                    name: "Matched Cases",
                  },
                ],
        },
      ],
    };
  }, [
    brainDeathData.length,
    matched.length,
    requests.length,
    filteredRecipientsKidney.length,
    filteredRecipientsLiver.length,
    role,
  ]);

  useEffect(() => {
    var chartDom = document.getElementById("main");

    var myChart = echarts.init(chartDom);

    option && myChart.setOption(option);
  }, [matched, option]);

  return (
    <section className="flex justify-center items-center">
      <div id="main" className="w-full h-[400px]"></div>
    </section>
  );
}
