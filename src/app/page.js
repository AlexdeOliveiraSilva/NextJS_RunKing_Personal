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
import { setCookie, parseCookies, destroyCookie } from "nookies";

export default function Login() {
  const searchParams = useSearchParams();
  const encodedCpf = searchParams.get("cpf");
  const decodedCpf = encodedCpf ? atob(encodedCpf) : "";
  const router = useRouter();

  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [userData2, setUserData2] = useState();
  const [eventData, setEventData] = useState();
  const [athletes, setAthletes] = useState([]);
  const [connectionError, setConnectionError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [cpf, setCpf] = useState(decodedCpf);
  const [birthDate, setBirthDate] = useState("");
  const [passport, setPassport] = useState("");

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
    const targetCpf = forcedCpf || cpf;
    if (!targetCpf) {
      console.warn("CPF inválido ou ausente!");
      toast.error("CPF inválido ou ausente!");
      return;
    }

    if (!birthDate) {
      console.warn("Data de nascimento inválida ou ausente!");
      toast.error("Data de nascimento inválida ou ausente!");
      return;
    }

    const cleanCpf = targetCpf.replace(/\D/g, "");
    const formattedBirthDate = birthDate.replaceAll("/", "-");
    const [day, month, year] = formattedBirthDate.split("-");
    const isoDate = `${year}-${month}-${day}`;

    setConnectionError(false);
    setUserError(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${URL_API}resgistersAthlete/${EVENT_SLUG}/${cleanCpf}/${isoDate}`
      );

      if (response.ok) {
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          toast.error("Atleta não encontrado. Verifique os dados informados.");
          setUserError(true);
          return;
        }
        setAthletes(data);

        const encodedCpf = btoa(cleanCpf);

        if (data.length > 1) {
          toast.success("Dados validados com successo!");
          router.push(`?event=${EVENT_SLUG}&cpf=${encodedCpf}`);
        } else if (data.length === 1) {
          toast.success("Dados validados com sucesso!");
          setCookie(null, "athleteUserData", JSON.stringify(data[0]), {
            maxAge: 60 * 60 * 24,
            path: "/",
          });
          router.push(`?uuid=${data[0].uuid}`);
        }
      } else {
        handleErrors(response);
      }
    } catch (error) {
      console.error("Erro ao buscar atletas:", error);
      toast.error("Dados Inválidos, tente novamente!");
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
        const cookies = parseCookies();
        if (cookies.athleteUserData) {
          setUserData2(JSON.parse(cookies.athleteUserData));
        }
      }

      await getUserData();

      if (decodedCpf) {
        await handleAthleteSearch(decodedCpf);
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
            userData2={userData2}
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
            onSubmit={handleAthleteSearch}
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
