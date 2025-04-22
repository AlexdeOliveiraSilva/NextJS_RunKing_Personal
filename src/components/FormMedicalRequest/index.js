"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputMask from "react-input-mask";

export default function FormMedicalRequest({
  urlAPI,
  eventId,
  userUUID,
  userData,
}) {
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
    personalRecord: "",
    medicalConsent: false,
  });

  useEffect(() => {
    if (userData) {
      const [emergencyContactName = "", emergencyContactPhone = ""] =
        userData.emergencyContact?.split(" - ") || [];

      setFormData({
        emergencyContactName,
        emergencyContactPhone,
        bloodType:
          userData.bloodType?.replace("_POS", "+").replace("_NEG", "-") || "",
        hasAllergy: userData.hasAllergy || "",
        allergyDescription: userData.allergyDescription || "",
        hasMedicalCondition: userData.hasMedicalCondition || "",
        medicalConditions: userData.medicalConditions || "",
        hasImplantedDevice: userData.hasImplantedDevice || "",
        implantedDevices: userData.implantedDevices || "",
        takesMedication: userData.takesMedication || "",
        medicationList: userData.medicationList || "",
        hasHelthInsurance: userData.healthInsuranceProvider ? "SIM" : "NAO",
        healthInsuranceProvider: userData.healthInsuranceProvider || "",
        personalRecord: userData.personalRecord || "",
        medicalConsent: userData.medicalConsent === 1,
      });
    }
  }, [userData]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { emergencyContactName, emergencyContactPhone, ...rest } = formData;

      const body = {
        ...rest,
        id: userData?.id,
        emergencyContact: `${emergencyContactName} - ${emergencyContactPhone}`,
        medicalConsent: formData.medicalConsent ? 1 : 0,
      };

      const url = `${urlAPI}athletes/${eventId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          uuid: userUUID,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar os dados");
      }

      toast.success("Dados enviados com sucesso!");
    } catch (err) {
      console.error(err.message);
      toast.error("Erro ao enviar os dados. Tente novamente.");
    }
  };

  return (
    <div className="medicalContainer">
      <div className="userInfo">
        <div className="userInfoImg">
          <img
            src={userData?.photo1Rekognition || "/images/User.png"}
            alt="User"
          />
          <img src={userData?.events.logo} alt="Logo Evento" />
        </div>
        <div className="userInfoText">
          <div className="boxUserInfoText">
            <p>Atleta</p>
            <h2>{userData?.name}</h2>
          </div>
          <div className="boxUserInfoText2">
            <div className="subBoxUserInfoText">
              <p>Número de Peito</p>
              <h2>{userData?.number}</h2>
            </div>
            <div className="subBoxUserInfoText">
              <p>Modalidade</p>
              <h2>{userData?.modality}</h2>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="boxForm1">
          <label>Recorde Pessoal</label>
          <InputMask
            mask="99:99:99"
            className="inputTextForm"
            name="personalRecord"
            value={formData.personalRecord}
            onChange={handleChange}
            placeholder="00:00:00"
          />
        </div>
        <div className="boxForm1">
          <label>Contato de Emergência</label>
          <input
            className="inputTextForm"
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder="Nome"
          />
          <InputMask
            mask="(99) 99999-9999"
            className="inputTextForm"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            placeholder="Telefone"
          />
        </div>
        <label>Tipo Sanguíneo</label>
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
            "DESCONHECIDO",
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
        <label>Possui Alergia?</label>
        <div className="boxForm">
          <label>
            <input
              type="radio"
              name="hasAllergy"
              value="SIM"
              checked={formData.hasAllergy === "SIM"}
              onChange={handleChange}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasAllergy"
              value="NAO"
              checked={formData.hasAllergy === "NAO"}
              onChange={handleChange}
            />
            Não
          </label>
        </div>
        {formData.hasAllergy === "SIM" && (
          <textarea
            rows={5}
            className="inputTextArea"
            name="allergyDescription"
            value={formData.allergyDescription}
            onChange={handleChange}
            placeholder="Por favor, especifique"
          />
        )}

        <label>
          Você possui alguma doença ou condição médica pré-existente, mesmo que
          controlada?
        </label>
        <div className="boxForm">
          <label>
            <input
              type="radio"
              name="hasMedicalCondition"
              value="SIM"
              checked={formData.hasMedicalCondition === "SIM"}
              onChange={handleChange}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasMedicalCondition"
              value="NAO"
              checked={formData.hasMedicalCondition === "NAO"}
              onChange={handleChange}
            />
            Não
          </label>
        </div>
        {formData.hasMedicalCondition === "SIM" && (
          <div className="boxFormGrid">
            {[
              "HIPERTENSAO",
              "DIABETES TIPO 1",
              "DIABETES TIPO 2",
              "COLESTEROL ALTO",
              "DOENCA CORONARIANA",
              "GOTA",
              "HIPERTIREOIDISMO",
              "HIPOTIROIDISMO",
              "ARRITMIA CARDIACA",
              "LUPUS",
              "ASMA",
              "DOENCA RENAL CRONICA",
              "OUTRAS",
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

        <label>Você possui algum dispositivo médico implantável ?</label>
        <div className="boxForm">
          <label>
            <input
              type="radio"
              name="hasImplantedDevice"
              value="SIM"
              checked={formData.hasImplantedDevice === "SIM"}
              onChange={handleChange}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasImplantedDevice"
              value="NAO"
              checked={formData.hasImplantedDevice === "NAO"}
              onChange={handleChange}
            />
            Não
          </label>
        </div>
        {formData.hasImplantedDevice === "SIM" && (
          <div className="boxFormGrid">
            {[
              "MARCAPASSO",
              "CDI",
              "BOMBA DE INSULINA",
              "STENT CARDIACO",
              "STENT CEREBRAL",
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

        <label>Você faz uso de medicamentos diariamente?</label>
        <div className="boxForm">
          <label>
            <input
              type="radio"
              name="takesMedication"
              value="SIM"
              checked={formData.takesMedication === "SIM"}
              onChange={handleChange}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="takesMedication"
              value="NAO"
              checked={formData.takesMedication === "NAO"}
              onChange={handleChange}
            />
            Não
          </label>
        </div>
        {formData.takesMedication === "SIM" && (
          <textarea
            rows={5}
            className="inputTextArea"
            name="medicationList"
            value={formData.medicationList}
            onChange={handleChange}
            placeholder="Por favor, especifique"
          />
        )}

        <label>Possui Plano de Saúde?</label>
        <div className="boxForm">
          <label>
            <input
              type="radio"
              name="hasHelthInsurance"
              value="SIM"
              checked={formData.hasHelthInsurance === "SIM"}
              onChange={handleChange}
            />
            Sim
          </label>
          <label>
            <input
              type="radio"
              name="hasHelthInsurance"
              value="NAO"
              checked={formData.hasHelthInsurance === "NAO"}
              onChange={handleChange}
            />
            Não
          </label>
        </div>
        {formData.hasHelthInsurance === "SIM" && (
          <input
            className="inputTextForm"
            type="text"
            name="healthInsuranceProvider"
            value={formData.healthInsuranceProvider}
            onChange={handleChange}
            placeholder="Se sim, indique qual"
          />
        )}
        <div className="boxConsent">
          <span className="consentText">
            Ao preencher este formulário, autorizo o uso dos meus dados
            pessoais, incluindo informações de saúde, exclusivamente para fins
            médicos e de segurança durante o evento.Esses dados serão tratados
            com sigilo, conforme a Lei Geral de Proteção de Dados (Lei nº
            13.709/2018), e não serão compartilhados com terceiros sem meu
            consentimento.Os dados serão armazenados de forma segura e
            utilizados apenas enquanto forem necessários para o evento.
          </span>
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
            Li e concordo com os termos acima e autorizo o uso dos meus dados
            pessoais para fins médicos durante o evento.
          </label>
        </div>
        <div className="boxFormButton">
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}
