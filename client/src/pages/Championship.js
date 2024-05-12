import React, { useState, useEffect, useContext } from "react";
import { Context } from "../context/AuthProvider";
import { Container, Button, Spinner } from "react-bootstrap";
import ButtonResume from "../components/Championship/ButtonResume";
import ButtonMatchs from "../components/Championship/ButtonMatchs";
import ButtonTable from "../components/Championship/ButtonTable";
import ButtonStatistic from "../components/Championship/ButtonStatistic";
import ChampionshipDataService from "../services/championship";
import UserDataService from "../services/user";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import "../styles/pages/Championship.css";
import ButtonExtraTable from "../components/Championship/ButtonExtraTable";

export function Championship() {
  let { id } = useParams();
  const { authenticated } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [championship, setChampionship] = useState([]);
  const [buttonChange, setButtonChange] = useState("results");
  const [favoritesChamp, setFavoritesChamp] = useState(
    JSON.parse(window.localStorage.getItem("favorites-champ")) || []
  );

  useEffect(() => {
    ChampionshipDataService.getChampionshipById(id).then((response) => {
      setChampionship(response.data[0]);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ChampionshipDataService.getChampionshipById(id).then((response) => {
        setChampionship(response.data[0]);
      });
    }, 600000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (authenticated)
      UserDataService.getFavorites(
        JSON.parse(localStorage.getItem("idUser"))
      ).then((response) => {
        if (response.data.championships.length > 0)
          setFavoritesChamp(response.data.championships);
        else setFavoritesChamp([]);
        if (response.data.teams.length > 0)
          localStorage.setItem(
            "favorites-teams",
            JSON.stringify(response.data.teams)
          );
        else localStorage.setItem("favorites-teams", JSON.stringify([]));
      });
  }, [authenticated]);

  useEffect(() => {
    window.localStorage.setItem(
      "favorites-champ",
      JSON.stringify(favoritesChamp)
    );
    if (authenticated)
      UserDataService.setFavorites(
        JSON.parse(localStorage.getItem("idUser")),
        JSON.parse(window.localStorage.getItem("favorites-teams")),
        favoritesChamp
      );
    // eslint-disable-next-line
  }, [favoritesChamp]);

  const addFavoriteChamp = () => {
    if (championship !== undefined) {
      let { idChampionship, name, img, imgChampionship } = championship;
      setFavoritesChamp((favorite) => [
        ...favorite,
        { idChampionship, name, img, imgChampionship },
      ]);
    }
  };

  const removeFavoriteChamp = () => {
    window.localStorage.removeItem("favorites-champ");
    if (championship !== undefined)
      setFavoritesChamp(
        favoritesChamp.filter(
          (champ) => champ.idChampionship !== championship.idChampionship
        )
      );
  };

  const isFavoriteChamp = () =>
    favoritesChamp?.some(
      (champ) => champ.idChampionship === championship.idChampionship
    );

  return (
    <Container>
      {loading ? (
        <div className="spinner-buttonMatchs">
          <Spinner animation="border" />
        </div>
      ) : typeof championship?.name === "undefined" ? (
        <div className="match-section_title">
          <span>CAMPEONATO NÃO ENCONTRADO</span>
        </div>
      ) : (
        <>
          <div className="heading">
            <img
              className="heading_logo heading_logo--1"
              src={
                championship.imgChampionship !== ""
                  ? `${championship.imgChampionship}`
                  : `${championship.img}`
              }
              alt={`${championship.name}`}
              title={`${championship.name}`}
            />
            <div className="heading_title">
              <div className="heading_name">{championship.name}</div>
            </div>
            <button
              id="button-favorite-championship"
              onClick={(e) => {
                e.preventDefault();
                isFavoriteChamp() ? removeFavoriteChamp() : addFavoriteChamp();
              }}
            >
              {isFavoriteChamp() ? (
                <AiFillStar className="icon-championship" />
              ) : (
                <AiOutlineStar className="icon-championship" />
              )}
            </button>
          </div>

          <div className="button-group-championship">
            <Button
              id={
                buttonChange === "results"
                  ? "button-championship-selected"
                  : "button-championship"
              }
              title="Resultados"
              onClick={() => setButtonChange("results")}
            >
              RESULTADOS
            </Button>
            <Button
              id={
                buttonChange === "calendar"
                  ? "button-championship-selected"
                  : "button-championship"
              }
              title="Calendário"
              onClick={() => setButtonChange("calendar")}
            >
              CALENDÁRIO
            </Button>
            <Button
              id={
                buttonChange === "classification"
                  ? "button-championship-selected"
                  : "button-championship"
              }
              title="Classificação"
              onClick={() => setButtonChange("classification")}
            >
              CLASSIFICAÇÃO
            </Button>
            <Button
              id={
                buttonChange === "statistic"
                  ? "button-championship-selected"
                  : "button-championship"
              }
              title="Estatísticas"
              onClick={() => setButtonChange("statistic")}
            >
              ESTATÍSTICAS
            </Button>
            {championship.extraTable && (
              <Button
                id={
                  buttonChange === "fullTable"
                    ? "button-championship-selected"
                    : "button-championship"
                }
                title="Estatísticas"
                onClick={() => setButtonChange("fullTable")}
              >
                TABELA COMPLETA
              </Button>
            )}
          </div>

          <div>
            <ButtonResume
              actived={buttonChange === "results"}
              championship={championship}
            />
            <ButtonMatchs
              actived={buttonChange === "calendar"}
              championship={championship}
            />
            <ButtonTable
              actived={buttonChange === "classification"}
              championship={championship}
            />
            <ButtonStatistic
              actived={buttonChange === "statistic"}
              championship={championship}
            />
            <ButtonExtraTable
              actived={buttonChange === "fullTable"}
              championship={championship}
            />
          </div>
        </>
      )}
    </Container>
  );
}
