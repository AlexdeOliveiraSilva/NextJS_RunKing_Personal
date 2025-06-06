"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/global";

const ListAthletes = ({ athletes }) => {
  const router = useRouter();
  const { t } = useContext(GlobalContext);

  const handleSelect = (uuid) => {
    router.push(`/?uuid=${uuid}`);
  };

  return (
    <div className="medicalContainerLogin">
      <h2 className="text-xl font-semibold mb-4">{t("selectTitle")}</h2>
      <div className="medicalContainerTable">
        <table className="tableAhtletes min-w-full mb-5 border border-gray-300 rounded-md bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">UUID</th>
              <th className="p-2 border">{t("name")}</th>
              <th className="p-2 border">{t("event")}</th>
              <th className="p-2 border">{t("bibNumber")}</th>
              <th className="p-2 border">{t("modality")}</th>
              <th className="p-2 border">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.uuid} className="text-center">
                <td className="p-2 border">{athlete.id}</td>
                <td className="p-2 border">{athlete.uuid}</td>
                <td className="p-2 border">{athlete.name}</td>
                <td className="p-2 border">{athlete.events.name}</td>
                <td className="p-2 border">{athlete.number}</td>
                <td className="p-2 border">{athlete.modality}</td>
                <td className="tdBtn p-2 border">
                  <button
                    className="btnTable"
                    onClick={() => handleSelect(athlete.uuid)}
                  >
                    {t("select")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListAthletes;
