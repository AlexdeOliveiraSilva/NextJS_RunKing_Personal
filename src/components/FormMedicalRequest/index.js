"use client";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputMask from "react-input-mask";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { GlobalContext } from "@/context/global";

export default function FormMedicalRequest({
  urlAPI,
  eventId,
  userUUID,
  userData,
  userData2,
  isLoading,
  setIsLoading,
}) {
  const router = useRouter();
  const [formAlreadySubmitted, setFormAlreadySubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodType: "",
    hasAllergy: "",
    allergyDescription: "",
    hasMedicalCondition: "",
    medicalConditions: "",
    hasImplantedDevice: "",
    implantedDevices: "",
    takesMedication: "",
    medicationList: "",
    hasHelthInsurance: "",
    healthInsuranceProvider: "",
    medicalConsent: false,
    medicalConditionOtherDescription: "",
    // personalRecord: "",
  });

  const { t } = useContext(GlobalContext);

  console.log(userData);

  const mapBloodTypeEnumToLabel = (value) => {
    const map = {
      O_POS: "O+",
      O_NEG: "O-",
      A_POS: "A+",
      A_NEG: "A-",
      B_POS: "B+",
      B_NEG: "B-",
      AB_POS: "AB+",
      AB_NEG: "AB-",
      UNKNOWN: t("unknown"),
    };
    return map[value] || value;
  };

  useEffect(() => {
    if (userData2?.extraData?.medicalConsent === 1) {
      setFormAlreadySubmitted(true);
      setFormData({
        emergencyContactName: userData2.extraData?.emergencyContact?.split(" - ")[0] || "",
        emergencyContactPhone: userData2.extraData?.emergencyContact?.split(" - ")[1] || "",
        bloodType: mapBloodTypeEnumToLabel(userData2.extraData?.bloodType),
        hasAllergy: userData2.extraData?.hasAllergy || "",
        allergyDescription: userData2.extraData?.allergyDescription || "",
        hasMedicalCondition: userData2.extraData?.hasMedicalCondition || "",
        medicalConditions: userData2.extraData?.medicalConditions?.replace(/_/g, " ") || "",
        hasImplantedDevice: userData2.extraData?.hasImplantedDevice || "",
        implantedDevices: userData2.extraData?.implantedDevices?.replace(/_/g, " ") || "",
        takesMedication: userData2.extraData?.takesMedication || "",
        medicationList: userData2.extraData?.medicationList || "",
        hasHelthInsurance: userData2.extraData?.hasHelthInsurance || "",
        healthInsuranceProvider: userData2.extraData?.healthInsuranceProvider || "",
        medicalConsent: userData2.extraData?.medicalConsent === 1,
        medicalConditionOtherDescription:
          userData2.extraData?.medicalConditionOtherDescription || "",
      });
    }
  }, [userData2]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = true;
    }
    if (!formData.emergencyContactPhone.trim()) {
      errors.emergencyContactPhone = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    setFormErrors({});

    setIsLoading(true);

    try {
      const { emergencyContactName, emergencyContactPhone, ...rest } = formData;

      const body = {
        ...rest,
        id: userData?.id,
        emergencyContact: `${emergencyContactName} - ${emergencyContactPhone}`,
        medicalConsent: formData.medicalConsent ? 1 : 0,
      };
      const url = `${urlAPI}accessAthletesSQS/${eventId}/${userUUID}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Erro ao enviar os dados"
          );
        }
      }

      toast.success("Dados enviados com sucesso!");
      setIsLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err.message);
      toast.error("Erro ao enviar os dados. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        <>
          <div className="medicalContainer">
            <div className="userInfo">
              <div className="userInfoText">
                <div className="boxUserInfoText">
                  <p>{t("athlete")}</p>
                  <h2>{userData?.name || userData2?.name}</h2>
                </div>
                <div className="boxUserInfoText2">
                  <div className="subBoxUserInfoText">
                    <p>{t("bibNumber")}</p>
                    <h2>{userData?.number || userData2?.number}</h2>
                  </div>
                  <div className="subBoxUserInfoText">
                    <p>{t("modality")}</p>
                    <h2>{userData?.modality || userData2?.modality}</h2>
                  </div>
                </div>
              </div>
              <div className="userInfoImg">
                {/* <img
                  src={userData?.photo1Rekognition || "/images/User.png"}
                  alt="User"
                /> */}
                <img src={userData?.events.logo || userData2?.events.logo} alt="Logo Evento" />
              </div>
            </div>
            {formAlreadySubmitted && !isEditing ? (
              <div className="formAlreadySentMessage">
                <h2>
                  {t("formAlreadySent")}
                  <br /> {t("goodLuck")}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="editButton"
                >
                  {t("editInformation")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form">
                <div className="boxForm1">
                  <label>
                    {t("emergencyContact")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className={` ${
                      formErrors.emergencyContactName
                        ? "inputError"
                        : "inputTextForm"
                    }`}
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder={t("name")}
                  />
                  {formErrors.emergencyContactName && (
                    <span className="errorText">Campo obrigatório</span>
                  )}
                  <InputMask
                    mask="(99) 99999-9999"
                    className={` ${
                      formErrors.emergencyContactPhone
                        ? "inputError"
                        : "inputTextForm"
                    }`}
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder={t("phone")}
                  />
                  {formErrors.emergencyContactPhone && (
                    <span className="errorText">Campo obrigatório</span>
                  )}
                </div>
                <label>{t("bloodType")}</label>
                <div className="boxFormBloodType">
                  {[
                    "O+",
                    "O-",
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    `${t("unknown")}`,
                  ].map((type) => (
                    <label key={type}>
                      <input
                        type="radio"
                        name="bloodType"
                        value={type}
                        checked={formData.bloodType === type}
                        onChange={handleChange}
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <label>{t("hasAllergy")}</label>
                <div className="boxForm">
                  <label>
                    <input
                      type="radio"
                      name="hasAllergy"
                      value="SIM"
                      checked={formData.hasAllergy === "SIM"}
                      onChange={handleChange}
                    />
                    {t("yes")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasAllergy"
                      value="NAO"
                      checked={formData.hasAllergy === "NAO"}
                      onChange={handleChange}
                    />
                    {t("no")}
                  </label>
                </div>
                {formData.hasAllergy === "SIM" && (
                  <textarea
                    rows={5}
                    className="inputTextArea"
                    name="allergyDescription"
                    value={formData.allergyDescription}
                    onChange={handleChange}
                    placeholder={t("pleaseSpecify")}
                  />
                )}

                <label>{t("hasCondition")}</label>
                <div className="boxForm">
                  <label>
                    <input
                      type="radio"
                      name="hasMedicalCondition"
                      value="SIM"
                      checked={formData.hasMedicalCondition === "SIM"}
                      onChange={handleChange}
                    />
                    {t("yes")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasMedicalCondition"
                      value="NAO"
                      checked={formData.hasMedicalCondition === "NAO"}
                      onChange={handleChange}
                    />
                    {t("no")}
                  </label>
                </div>
                {formData.hasMedicalCondition === "SIM" && (
                  <div className="boxFormGrid">
                    {[
                      `${t("hiperTension")}`,
                      `${t("TypeOneDiabetes")}`,
                      `${t("TypeTwoDiabetes")}`,
                      `${t("highCholesterol")}`,
                      `${t("coronaryDisease")}`,
                      `${t("drop")}`,
                      `${t("hyperthyroidism")}`,
                      `${t("hypothyroidism")}`,
                      `${t("cardiacArrhythmia")}`,
                      `${t("lupus")}`,
                      `${t("asthma")}`,
                      `${t("chronicKidneyDisease")}`,
                      `${t("other")}`,
                    ].map((cond) => (
                      <label key={cond}>
                        <input
                          type="radio"
                          name="medicalConditions"
                          value={cond}
                          checked={formData.medicalConditions === cond}
                          onChange={handleChange}
                        />
                        {cond}
                      </label>
                    ))}
                  </div>
                )}
                {formData.medicalConditions === "OUTRAS" && (
                  <input
                    className="inputTextForm"
                    type="text"
                    name="medicalConditionOtherDescription"
                    value={formData.medicalConditionOtherDescription || ""}
                    onChange={handleChange}
                    placeholder={t("pleaseSpecify")}
                  />
                )}

                <label>{t("hasDevice")}</label>
                <div className="boxForm">
                  <label>
                    <input
                      type="radio"
                      name="hasImplantedDevice"
                      value="SIM"
                      checked={formData.hasImplantedDevice === "SIM"}
                      onChange={handleChange}
                    />
                    {t("yes")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasImplantedDevice"
                      value="NAO"
                      checked={formData.hasImplantedDevice === "NAO"}
                      onChange={handleChange}
                    />
                    {t("no")}
                  </label>
                </div>
                {formData.hasImplantedDevice === "SIM" && (
                  <div className="boxFormGrid">
                    {[
                      `${t("pacemaker")}`,
                      `CDI`,
                      `${t("insulinPump")}`,
                      `${t("heartStent")}`,
                      `${t("brainStent")}`,
                    ].map((device) => (
                      <label key={device}>
                        <input
                          type="radio"
                          name="implantedDevices"
                          value={device}
                          checked={formData.implantedDevices === device}
                          onChange={handleChange}
                        />
                        {device}
                      </label>
                    ))}
                  </div>
                )}

                <label>{t("takesMedication")}</label>
                <div className="boxForm">
                  <label>
                    <input
                      type="radio"
                      name="takesMedication"
                      value="SIM"
                      checked={formData.takesMedication === "SIM"}
                      onChange={handleChange}
                    />
                    {t("yes")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="takesMedication"
                      value="NAO"
                      checked={formData.takesMedication === "NAO"}
                      onChange={handleChange}
                    />
                    {t("no")}
                  </label>
                </div>
                {formData.takesMedication === "SIM" && (
                  <textarea
                    rows={5}
                    className="inputTextArea"
                    name="medicationList"
                    value={formData.medicationList}
                    onChange={handleChange}
                    placeholder={t("pleaseSpecify")}
                  />
                )}

                <label>{t("hasInsurance")}</label>
                <div className="boxForm">
                  <label>
                    <input
                      type="radio"
                      name="hasHelthInsurance"
                      value="SIM"
                      checked={formData.hasHelthInsurance === "SIM"}
                      onChange={handleChange}
                    />
                    {t("yes")}
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hasHelthInsurance"
                      value="NAO"
                      checked={formData.hasHelthInsurance === "NAO"}
                      onChange={handleChange}
                    />
                    {t("no")}
                  </label>
                </div>
                {formData.hasHelthInsurance === "SIM" && (
                  <input
                    className="inputTextForm"
                    type="text"
                    name="healthInsuranceProvider"
                    value={formData.healthInsuranceProvider}
                    onChange={handleChange}
                    placeholder={t("whichInsurance")}
                  />
                )}
                <div className="boxConsent">
                  <span className="consentText">{t("consentNotice")}</span>
                  <label className="consentText2">
                    <input
                      type="checkbox"
                      name="medicalConsent"
                      checked={formData.medicalConsent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          medicalConsent: e.target.checked,
                        }))
                      }
                    />
                    {t("agreeTerms")}
                  </label>
                </div>
                <div className="boxFormButton">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="cancelEditButton"
                      style={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                      }}
                    >
                      {t("cancelEdit")}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!formData.medicalConsent}
                    style={{
                      backgroundColor: formData.medicalConsent
                        ? " #32E0C4"
                        : " #ccc",
                      cursor: formData.medicalConsent
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    {t("submit")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
