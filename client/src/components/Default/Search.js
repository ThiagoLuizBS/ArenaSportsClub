import React, { useEffect } from "react";
import { ListGroup, Button, Placeholder, Row, Col } from "react-bootstrap";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import "../../styles/components/Default/Search.css";

export function Search(props) {
  const { theme, listTeams, listChamps, setSearchField } = props;
  const { favoritesTeams, setFavoritesTeams } = props;

  useEffect(() => {
    if (favoritesTeams !== undefined) {
      window.localStorage.setItem(
        "favorites-teams",
        JSON.stringify(favoritesTeams)
      );
    }
  }, [favoritesTeams]);

  const addFavoriteTeams = (team, i) => {
    if (team !== "undefined") {
      let { idTeam, name, img } = team;
      setFavoritesTeams((favorite) => [...favorite, { idTeam, name, img }]);
    }
  };

  const removeFavoriteTeams = (team) => {
    window.localStorage.removeItem("favorites-teams");
    if (favoritesTeams !== "undefined")
      setFavoritesTeams(
        favoritesTeams.filter((tea) => tea.idTeam !== team.idTeam)
      );
  };

  const isFavoriteTeams = (team) =>
    favoritesTeams?.some((tea) => tea.idTeam === team.idTeam);

  const deleteSearch = () => {
    setSearchField("");
  };

  const formatChampionshipTitle = (name) => {
    const lastIndex = name.lastIndexOf("-");
    return name.slice(0, lastIndex).trim();
  };

  return (
    <ListGroup id={theme === "nav" ? "" : "display-search"}>
      {typeof listTeams === "undefined" ? (
        <ListGroup.Item id="list-group-sidebar-search">
          <Placeholder type="text" animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
        </ListGroup.Item>
      ) : theme === "nav" ? (
        <>
          {listTeams?.map((team, i) => (
            <Link
              to={`/equipe/${team.idTeam}`}
              key={i}
              id="list-group-navbar-search"
              onClick={() => deleteSearch()}
            >
              <Row className="justify-content-center-search">
                <Col md={2} sm={2} xs={2} className="col-logo-search">
                  <img
                    className="pais-margin"
                    src={team.img}
                    alt={`${team.img}`}
                  />
                </Col>
                <Col md={10} sm={10} xs={10} className="col-search">
                  <Row>
                    <span className="name-search">
                      {formatChampionshipTitle(team.name)}
                    </span>
                  </Row>
                  <Row>
                    <span className="locality-search">{team.locality}</span>
                  </Row>
                </Col>
              </Row>
            </Link>
          ))}
          {listChamps?.map((champ, i) => (
            <Link
              to={`/campeonato/${champ.idChampionship}`}
              key={i}
              id="list-group-navbar-search"
              onClick={() => deleteSearch()}
            >
              <Row className="justify-content-center-search">
                <Col md={2} sm={2} xs={2} className="col-logo-search">
                  <img
                    className="pais-margin"
                    src={
                      champ.imgChampionship !== ""
                        ? `${champ.imgChampionship}`
                        : `${champ.img}`
                    }
                    alt={`${champ.name}`}
                  />
                </Col>
                <Col md={10} sm={10} xs={10} className="col-search">
                  <Row>
                    <span className="name-search">{champ.name}</span>
                  </Row>
                </Col>
              </Row>
            </Link>
          ))}
        </>
      ) : (
        listTeams?.map((team, i) => (
          <ListGroup.Item
            key={i}
            id="list-group-sidebar-search"
            className="justify-content-center-search"
          >
            <Row className="justify-content-center-search">
              <Col md={2} sm={2} xs={2} className="col-logo-search">
                <img
                  className="pais-margin"
                  src={team.img}
                  alt={`${team.img}`}
                />
              </Col>
              <Col md={9} sm={9} xs={9} className="col-search">
                <Row>
                  <span className="name-search">{team.name}</span>
                </Row>
                <Row>
                  <span className="locality-search">{team.locality}</span>
                </Row>
              </Col>
              {favoritesTeams !== undefined ? (
                <Col md={1} sm={1} xs={1} className="col-search">
                  <Button
                    id="button-favorite-sidebar"
                    onClick={(e) => {
                      e.preventDefault();
                      isFavoriteTeams(team)
                        ? removeFavoriteTeams(team)
                        : addFavoriteTeams(team);
                    }}
                  >
                    {isFavoriteTeams(team) ? <AiFillStar /> : <AiOutlineStar />}
                  </Button>
                </Col>
              ) : (
                <Col md={1} sm={1} xs={1}></Col>
              )}
            </Row>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );
}

export default Search;
