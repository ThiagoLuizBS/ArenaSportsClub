import React, { useEffect, useState, useRef } from "react";
import { Container, ListGroup, Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineStar, AiFillStar, AiFillPlusCircle } from "react-icons/ai";
import { ImTrophy } from "react-icons/im";
import { GiStarsStack } from "react-icons/gi";
import { MdGroups } from "react-icons/md";
import Search from "../Default/Search";
import TeamDataService from "../../services/team";
import ChampionshipDataService from "../../services/championship";
import "../../styles/components/Home/SideBar.css";

export function SideBar() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("");
  const [championshipList, setChampionshipList] = useState([]);
  const [favoritesChamp, setFavoritesChamp] = useState(
    JSON.parse(window.localStorage.getItem("favorites-champ")) || []
  );
  const [teamsSearchActive, setTeamsSearchActive] = useState(false);
  const [listTeams, setListTeams] = useState([]);
  const [favoritesTeams, setFavoritesTeams] = useState(
    JSON.parse(window.localStorage.getItem("favorites-teams")) || []
  );

  useEffect(() => {
    ChampionshipDataService.getChampionshipsPriority().then((response) => {
      setChampionshipList(response.data);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ChampionshipDataService.getChampionshipsPriority().then((response) =>
        setChampionshipList(response.data)
      );
    }, 600000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (searchField === "") {
      setListTeams([]);
    } else {
      TeamDataService.getTeams(searchField).then((response) => {
        setListTeams(response.data.team);
      });
    }
  }, [searchField]);

  useEffect(() => {
    if (teamsSearchActive) inputRef.current.focus();
  }, [teamsSearchActive]);

  const changeActive = (active) => setTeamsSearchActive(active);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchField(value);
  };

  useEffect(() => {
    window.localStorage.setItem(
      "favorites-champ",
      JSON.stringify(favoritesChamp)
    );
  }, [favoritesChamp]);

  useEffect(() => {
    window.localStorage.setItem(
      "favorites-teams",
      JSON.stringify(favoritesTeams)
    );
  }, [favoritesTeams]);

  const addFavoriteChamp = (championship, i) => {
    if (championship !== "undefined") {
      let { idChampionship, name, img, imgChampionship } = championship;
      setFavoritesChamp((favorite) => [
        ...favorite,
        { idChampionship, name, img, imgChampionship },
      ]);
    }
  };

  const removeFavoriteChamp = (championship) => {
    window.localStorage.removeItem("favorites-champ");
    if (championshipList !== "undefined")
      setFavoritesChamp(
        favoritesChamp.filter(
          (camp) => camp.idChampionship !== championship.idChampionship
        )
      );
  };

  const isFavoriteChamp = (championship) =>
    favoritesChamp?.some(
      (camp) => camp.idChampionship === championship.idChampionship
    );

  const addFavoriteTeams = (team, i) => {
    if (team !== "undefined") {
      let { id, name, logo, locality } = team;
      setFavoritesTeams((favorite) => [
        ...favorite,
        { id, name, logo, locality },
      ]);
    }
  };

  const removeFavoriteTeams = (team) => {
    window.localStorage.removeItem("favorites-teams");
    if (listTeams !== "undefined")
      setFavoritesTeams(favoritesTeams.filter((tea) => tea.id !== team.id));
  };

  const isFavoriteTeams = (team) =>
    favoritesTeams?.some((tea) => tea.id === team.id);

  return (
    <Container id="container-side-bar">
      <div id="titleSideBar" className="border-bottom-side-bar">
        <GiStarsStack />
        <span id="title-text-side-bar">Meus campeonatos</span>
      </div>
      {favoritesChamp[0]?.id === 0 || favoritesChamp.length === 0 ? (
        <span id="titleSideBar">Nenhum Campeonato favorito</span>
      ) : (
        favoritesChamp.map((favorito, i) => (
          <Link
            key={i}
            to={`/campeonato/${favorito.idChampionship}`}
            id="side-bar-link"
          >
            <ListGroup>
              <ListGroup.Item id="list-group-sidebar">
                <Row className="justify-content-md-center">
                  <Col md={2} sm={2} className="col-sidebar-center">
                    <img
                      className="pais-margin"
                      src={
                        favorito.imgChampionship !== ""
                          ? `${favorito.imgChampionship}`
                          : `${favorito.img}`
                      }
                      alt={`${favorito.img}`}
                      title={`${favorito.name}`}
                    />
                  </Col>
                  <Col
                    md={9}
                    sm={9}
                    id="name-camp-sidebar"
                    className="col-sidebar"
                  >
                    <span>{favorito.name}</span>
                  </Col>
                  <Col md={1} sm={1} className="col-sidebar-left">
                    <Button
                      id="button-favorite-sidebar"
                      onClick={(e) => {
                        e.preventDefault();
                        isFavoriteChamp(favorito)
                          ? removeFavoriteChamp(favorito)
                          : addFavoriteChamp(favorito);
                      }}
                    >
                      {isFavoriteChamp(favorito) ? (
                        <AiFillStar />
                      ) : (
                        <AiOutlineStar />
                      )}
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Link>
        ))
      )}
      <div id="titleSideBar" className="border-bottom-side-bar">
        <ImTrophy />
        <span id="title-text-side-bar">Principais Campeonatos</span>
      </div>
      {typeof championshipList === "undefined" ? (
        <p>Loading...</p>
      ) : (
        championshipList?.map((championship, i) => (
          <Link
            key={i}
            to={`/campeonato/${championship.idChampionship}`}
            id="side-bar-link"
          >
            <ListGroup>
              <ListGroup.Item id="list-group-sidebar">
                <Row className="justify-content-md-center">
                  <Col md={2} sm={2} className="col-sidebar-center">
                    <img
                      className="pais-margin"
                      src={
                        championship.imgChampionship !== ""
                          ? `${championship.imgChampionship}`
                          : `${championship.img}`
                      }
                      alt={`${championship.img}`}
                      title={`${championship.name}`}
                    />
                  </Col>
                  <Col
                    md={9}
                    sm={9}
                    id="name-camp-sidebar"
                    className="col-sidebar"
                  >
                    <span>{championship.name}</span>
                  </Col>
                  <Col md={1} sm={1} className="col-sidebar-left">
                    <Button
                      id="button-favorite-sidebar"
                      onClick={(e) => {
                        e.preventDefault();
                        isFavoriteChamp(championship)
                          ? removeFavoriteChamp(championship)
                          : addFavoriteChamp(championship);
                      }}
                    >
                      {isFavoriteChamp(championship) ? (
                        <AiFillStar />
                      ) : (
                        <AiOutlineStar />
                      )}
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Link>
        ))
      )}
      <div id="titleSideBar" className="border-bottom-side-bar">
        <MdGroups />
        <span id="title-text-side-bar">Minhas Equipes</span>
      </div>
      {favoritesTeams[0]?.id === 0 || favoritesTeams.length === 0 ? (
        <span id="titleSideBar">Nenhuma Equipe favorita</span>
      ) : (
        favoritesTeams.map((favorito, i) => (
          <Link key={i} to="/equipe" id="side-bar-link">
            <ListGroup>
              <ListGroup.Item id="list-group-sidebar">
                <Row className="justify-content-md-center">
                  <Col md={2}>
                    <img
                      className="pais-margin"
                      src={favorito.logo}
                      alt={`${favorito.logo}`}
                      title={`${favorito.name}`}
                    />
                  </Col>
                  <Col md={8} id="name-camp-sidebar">
                    <span>{favorito.name}</span>
                  </Col>
                  <Col md={2}>
                    <Button
                      id="button-favorite-sidebar"
                      onClick={(e) => {
                        e.preventDefault();
                        isFavoriteTeams(favorito)
                          ? removeFavoriteTeams(favorito)
                          : addFavoriteTeams(favorito);
                      }}
                    >
                      {isFavoriteTeams(favorito) ? (
                        <AiFillStar />
                      ) : (
                        <AiOutlineStar />
                      )}
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Link>
        ))
      )}
      <div id="titleSideBar" className="border-bottom-side-bar">
        <Button
          id="button-favorite-sidebar"
          onClick={(e) => {
            e.preventDefault();
            teamsSearchActive ? changeActive(false) : changeActive(true);
          }}
        >
          <AiFillPlusCircle />
          <span id="title-text-side-bar">Adicionar Equipe</span>
        </Button>
      </div>
      {teamsSearchActive ? (
        <>
          <div id="form-sidebar">
            <Form.Control
              type="search"
              placeholder="Pesquisar"
              aria-label="Search"
              value={searchField}
              onChange={handleSearch}
              ref={inputRef}
            />
          </div>
          {listTeams?.length > 0 ? (
            <Search
              theme={"side"}
              listTeams={listTeams}
              favoritesTeams={favoritesTeams}
              setFavoritesTeams={setFavoritesTeams}
              setSearchField={setSearchField}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
export default SideBar;
