"use client";
import { GlobalContext } from "@/context/global";
import React, { useContext, useState } from "react";
import InputMask from "react-input-mask";

const FormLogin = ({
  eventData,
  urlAPI,
  eventSlug,
  isLoading,
  setIsloading,
  cpf,
  setCpf,
  birthDate,
  setBirthDate,
  onSubmit,
}) => {
  const { t } = useContext(GlobalContext);

  const faqData = [
    {
      question: t("faq.question1"),
      answer: t("faq.answer1"),
    },
    {
      question: t("faq.question2"),
      answer: t("faq.answer2"),
    },
    {
      question: t("faq.question3"),
      answer: t("faq.answer3"),
    },
    {
      question: t("faq.question4"),
      answer: t("faq.answer4"),
    },
    // {
    //   question: t("faq.question5"),
    //   answer: t("faq.answer5"),
    // },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="medicalContainerLogin">
      <div className="userInfo">
        <div className="userInfoText">
          <div className="boxUserInfoText">
            <p>{t("event")}</p>
            <h2>{eventData?.event?.name}</h2>
          </div>
        </div>
        <div className="userInfoImg">
          <img src={eventData?.event?.logo} alt="Logo Evento" />
        </div>
      </div>
      <form className="formLogin" onSubmit={handleSubmit}>
        <div className="boxForm1">
          <label>
            CPF {t("or")} {t("passport")}
          </label>
          <input
            type="text"
            className="inputTextForm"
            name="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF ou Passaporte"
          />
        </div>
        <div className="boxForm1">
          <label>{t("birthDate")}</label>
          <InputMask
            mask="99/99/9999"
            className="inputTextForm"
            name="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="DD/MM/AAAA"
          />
        </div>
        <div className="boxFormButton">
          <button type="submit">{t("advance")}</button>
        </div>
      </form>
      <div className="faqSection mt-2">
        <h3 className="text-xl font-semibold mb-4">
          🩺 FAQ - Cadastro de Dados Médicos
        </h3>

        {faqData.map((item, index) => (
          <details
            key={index}
            className="w-full mb-4 border border-gray-300 rounded-md p-4 bg-white"
          >
            <summary className="cursor-pointer font-medium text-gray-800">
              {index + 1}. {item.question}
            </summary>
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FormLogin;
