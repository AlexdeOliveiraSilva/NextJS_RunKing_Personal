"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import FormMedicalRequest from "@/components/FormMedicalRequest";
import FormLogin from "@/components/FormLogin";
import ListAthletes from "@/components/ListAthletes";
import toast from "react-hot-toast";

export default function Login() {
  const searchParams = useSearchParams();
  const encodedCpf = searchParams.get("cpf");
  const encodedPassport = searchParams.get("passport");

  const decodedCpf = encodedCpf ? atob(encodedCpf) : "";
  const decodedPassport = encodedPassport ? atob(encodedPassport) : "";

  const router = useRouter();

  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [eventData, setEventData] = useState();
  const [athletes, setAthletes] = useState([]);
  const [connectionError, setConnectionError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [cpf, setCpf] = useState(decodedCpf);
  const [birthDate, setBirthDate] = useState("");
  const [passport, setPassport] = useState(decodedPassport);

  const USER_UUID = searchParams.get("uuid");
  const EVENT_SLUG = searchParams.get("event");
  const URL_API = "https://api.runking.com.br/";
  const eventId = userData?.events?.id;

  const shouldShowFormMedicalRequest = USER_UUID || athletes.length === 1;

  const getUserData = async () => {
    setConnectionError(false);
    setUserError(false);

    try {
      const response = await fetch(`${URL_API}checkinCallChamber/${USER_UUID}`);

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        localStorage.setItem("user_name", data?.name);
        localStorage.setItem("user_number", data?.number);
        localStorage.setItem("event_name", data?.number);
      } else if (response.status >= 500) {
        setConnectionError(true);
      } else {
        setUserError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setUserError(true);
    }
  };

  const handleCapture = (imageSrc) => {
    setModalCapture(true);
    setCapturedImage(imageSrc);
  };

  const signOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.clear("user_image");
      setImage("");
      setIsLoading(false);
    }, 1000);
  };

  const closeAndSave = () => {
    setTimeout(() => {
      setImage(localStorage.getItem("user_image"));
      setModalCapture(false);
      setIsLoading(false);
    }, 1000);
  };

  const getEventData = async () => {
    if (!EVENT_SLUG) return;

    try {
      const response = await fetch(`${URL_API}eventBySlug/${EVENT_SLUG}`);
      if (response.ok) {
        const data = await response.json();
        setEventData(data);
      } else {
        handleErrors(response);
      }
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      setUserError(true);
    }
  };

  const handleAthleteSearch = async (forcedCpf) => {
    const cleanCpf = (forcedCpf || cpf)?.replace(/\D/g, "");
    const cleanPassport = passport?.trim();

    const isUsingCpf = !!cleanCpf;
    const isUsingPassport = !!cleanPassport;

    if (!isUsingCpf && !isUsingPassport) {
      toast.error("Informe o CPF ou Passaporte.");
      return;
    }

    if (!birthDate) {
      toast.error("Data de nascimento inválida ou ausente!");
      return;
    }

    const formattedBirthDate = birthDate.replaceAll("/", "-");
    const [day, month, year] = formattedBirthDate.split("-");
    const isoDate = `${year}-${month}-${day}`;

    setConnectionError(false);
    setUserError(false);
    setIsLoading(true);

    try {
      const identifier = isUsingCpf ? cleanCpf : cleanPassport;

      const response = await fetch(
        `${URL_API}resgistersAthlete/${EVENT_SLUG}/${identifier}/${isoDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setAthletes(data);

        if (data.length === 0) {
          toast.error(
            "Nenhum atleta encontrado. Verifique os dados informados."
          );
          setUserError(true);
          return;
        }

        const encodedIdentifier = btoa(identifier);
        if (data.length > 1) {
          toast.success("Dados validados com sucesso!");
          const param = isUsingCpf ? "cpf" : "passport";
          router.push(`?event=${EVENT_SLUG}&${param}=${encodedIdentifier}`);
        } else if (data.length === 1) {
          toast.success("Dados validados com sucesso!");
          router.push(`?uuid=${data[0].uuid}`);
        }
      } else {
        handleErrors(response);
      }
    } catch (error) {
      console.error("Erro ao buscar atletas:", error);
      toast.error("Dados inválidos, tente novamente!");
      setUserError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrors = (response) => {
    if (response.status === 404) {
      toast.error("Atleta não encontrado. Verifique os dados informados.");
      setUserError(true);
    } else if (response.status >= 500) {
      toast.error(
        "Erro de conexão com o servidor. Tente novamente mais tarde."
      );
      setConnectionError(true);
    } else {
      toast.error("Erro inesperado. Verifique os dados e tente novamente.");
      setUserError(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setImage(localStorage.getItem("user_image"));

      await getEventData();

      if (shouldShowFormMedicalRequest) {
        await getUserData();
      }

      if (decodedCpf || decodedPassport) {
        await handleAthleteSearch(decodedCpf || decodedPassport);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [USER_UUID, athletes.length]);

  return (
    <main className="fullContainer">
      {/* {modalCapture == true && (
        <ModalTakePic
          close={() => closeAndSave()}
          uuid={USER_UUID}
        ></ModalTakePic>
      )} */}
      <Header title="Login" />
      <div className="homeContent">
        {/* <div className="userContent">
          <ProfileContent
            status={!!connectionError ? 3 : !!userError ? 2 : 1}
            name={!!userData?.name ? userData?.name : "-"}
            number={!!userData?.number ? userData?.number : "-"}
            auth={!!image ? 1 : 0}
          ></ProfileContent>
          <TakePicture
            status={!!image ? true : false}
            img={image}
          ></TakePicture>
        </div>
        {!image ? (
          <button
            onClick={() => handleCapture()}
            className="btnGreen profileBtn"
          >
            {isLoading == true ? <Loading></Loading> : "Tirar Foto"}
          </button>
        ) : (
          <button
            onClick={() => handleCapture()}
            className="btnGreen profileBtn"
          >
            {isLoading == true ? <Loading></Loading> : "Reenviar Foto"}
          </button>
        )} */}
        {isLoading ? (
          <Loading />
        ) : shouldShowFormMedicalRequest ? (
          <FormMedicalRequest
            userData={userData}
            userUUID={USER_UUID || athletes[0]?.uuid}
            urlAPI={URL_API}
            eventId={eventId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : athletes.length > 1 ? (
          <ListAthletes athletes={athletes} />
        ) : (
          <FormLogin
            eventData={eventData}
            eventSlug={EVENT_SLUG}
            urlAPI={URL_API}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            cpf={cpf}
            setCpf={setCpf}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            passport={passport}
            setPassport={setPassport}
            onSubmit={handleAthleteSearch}
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
