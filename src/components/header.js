"use client";
import { useContext } from "react";
import { GlobalContext } from "@/context/global";
import Select from "react-select";

const languageOptions = [
  {
    value: "pt",
    label: (
      <img src="https://flagcdn.com/w40/br.png" alt="Português" width={35} />
    ),
  },
  {
    value: "en",
    label: (
      <img src="https://flagcdn.com/w40/us.png" alt="English" width={35} />
    ),
  },
  {
    value: "es",
    label: (
      <img src="https://flagcdn.com/w40/es.png" alt="Español" width={35} />
    ),
  },
];

export default function Header() {
  const { language, setLanguage, t } = useContext(GlobalContext);

  const handleChange = (selectedOption) => {
    setLanguage(selectedOption.value);
  };

  return (
    <div
      className="greyBackground"
      style={{
        position: "relative",
        flexDirection: "column",
        padding: "10px 0",
        height: "auto",
      }}
    >
      <img width={150} src="/images/logo-runking.png" />
      <div className="headerContent">
        <span className="headerTitle">{t("headerTitle")}</span>
        <div className="headerSelect">
          <Select
            options={languageOptions}
            value={languageOptions.find((opt) => opt.value === language)}
            onChange={handleChange}
            isSearchable={false}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: () => null,
            }}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "30px",
                padding: "0 4px",
                border: "none",
                backgroundColor: " #222831",
                outline: "none",
                boxShadow: "none",
                cursor: "pointer",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "rgba(34, 40, 49, 0.98)"
                  : state.isFocused
                  ? "rgba(34, 40, 49, 0.94)"
                  : "#222831",
                margin: "0",
                color: "#000",
                cursor: "pointer",
              }),
              menuList: (base) => ({
                ...base,
                paddingTop: 0,
                paddingBottom: 0,
              }),
              menu: (base) => ({
                ...base,
                marginTop: 0,
                marginBottom: 0,
              }),
              singleValue: (base) => ({
                ...base,
                display: "flex",
                alignItems: "center",
                backgroundColor: " #222831",
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
