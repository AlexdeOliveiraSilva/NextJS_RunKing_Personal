"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import FormMedicalRequest from "@/components/FormMedicalRequest";
import FormLogin from "@/components/FormLogin";
import ListAthletes from "@/components/ListAthletes";
import toast from "react-hot-toast";
import { setCookie, parseCookies, destroyCookie } from "nookies";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [userData2, setUserData2] = useState();
  const [eventData, setEventData] = useState();
  const [athletes, setAthletes] = useState([]);
  const [connectionError, setConnectionError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passport, setPassport] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [userUuid, setUserUuid] = useState("");

  const URL_API = "https://api.runking.com.br/";
  const eventId = userData?.events?.id;

  const shouldShowFormMedicalRequest = Boolean(
    userUuid || (athletes && athletes.length === 1)
  );

  useEffect(() => {
    const eventSlugParam = searchParams.get("event");

    if (eventSlugParam === "corrida-iluminada-de-natal-2025") {
      window.location.replace("https://bit.ly/WA_MEDICO?r=qr");
    }
  }, [searchParams]);

  useEffect(() => {
    // Corrige URLs malformadas do RD Station (ex: ?event=slug?utm_source=...)
    // O segundo "?" quebra o parsing dos searchParams
    const rawUrl = window.location.href;
    const firstQ = rawUrl.indexOf("?");
    if (firstQ !== -1) {
      const queryPart = rawUrl.substring(firstQ + 1);
      const secondQ = queryPart.indexOf("?");
      if (secondQ !== -1) {
        const cleanUrl = rawUrl.substring(0, firstQ + 1) + queryPart.replace(/\?/g, "&");
        window.history.replaceState({}, "", cleanUrl);
      }
    }

    let eventSlugParam = new URLSearchParams(window.location.search).get("event");
    const userUuidParam = new URLSearchParams(window.location.search).get("uuid");
    const encodedCpfParam = new URLSearchParams(window.location.search).get("cpf");

    setEventSlug(eventSlugParam);
    setUserUuid(userUuidParam);
    if (encodedCpfParam) {
      try {
        setCpf(atob(encodedCpfParam));
      } catch {
        console.error("Erro ao decodificar CPF");
      }
    }
  }, [searchParams]);

  const getUserData = async () => {
    if (!userUuid) return;

    setConnectionError(false);
    setUserError(false);

    try {
      const response = await fetch(`${URL_API}checkinCallChamber/${userUuid}`);

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        localStorage.setItem("user_name", data?.name);
        localStorage.setItem("user_number", data?.number);
        localStorage.setItem("event_name", data?.events?.name);
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

  const getEventData = async () => {
    if (!eventSlug) return;

    try {
      const response = await fetch(`${URL_API}eventBySlug/${eventSlug}`);
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
    if (!eventSlug) return;
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
        `${URL_API}resgistersAthlete/${eventSlug}/${cleanCpf}/${isoDate}`
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
          router.push(`?event=${eventSlug}&cpf=${encodedCpf}`);
        } else if (data.length === 1) {
          toast.success("Dados validados com sucesso!");
          setCookie(null, "athleteUserData", JSON.stringify(data[0]), {
            maxAge: 60 * 60 * 24,
            path: "/",
          });

          setUserUuid(data[0].uuid);

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

      if (eventSlug) {
        await getEventData();
      }

      if (userUuid) {
        await getUserData();
      }

      if (shouldShowFormMedicalRequest) {
        const cookies = parseCookies();
        if (cookies.athleteUserData) {
          setUserData2(JSON.parse(cookies.athleteUserData));
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [userUuid, eventSlug]);

  return (
    <main className="fullContainer">
      <Header title="Login" />
      <div className="homeContent">
        {isLoading ? (
          <Loading />
        ) : shouldShowFormMedicalRequest ? (
          <FormMedicalRequest
            userData={userData}
            userUUID={userUuid || athletes[0]?.uuid}
            urlAPI={URL_API}
            eventId={eventId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            athletes={athletes}
            setAthletes={setAthletes}
          />
        ) : athletes.length > 1 ? (
          <ListAthletes athletes={athletes} />
        ) : (
          <FormLogin
            eventData={eventData}
            eventSlug={eventSlug}
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

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginContent />
    </Suspense>
  );
}
