import React, { Fragment, useEffect, useState } from "react";
import { Container, Col, ListGroup, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import MatchDataService from "../../services/match.js";
import { GiSoccerBall } from "react-icons/gi";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import "../../styles/components/Home/Results.css";

export function Results({ favoritesChamp, favoritesTeams }) {
  const getTodayDate = (x) => {
    var date = new Date();
    date.setDate(date.getDate() + x);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    return day + "-" + month + "-" + year;
  };

  const getFilterSelect = (x) => {
    var date = getTodayDate(x);
    date = date.replace("-", "/");
    date = date.replace("-2024", "");
    return date;
  };

  const [loading, setLoading] = useState(true);
  const [matchsData, setMatchsData] = useState([]);
  const [dateFilter, setDateFilter] = useState(getTodayDate(0));
  const [buttonExpand, setButtonExpand] = useState([]);
  const [filterSelected, setFilterSelected] = useState("");
  const [buttonChange, setButtonChange] = useState({
    all: true,
    live: false,
    finished: false,
    next: false,
  });

  useEffect(() => {
    MatchDataService.getMatchsByDate(dateFilter, favoritesChamp).then(
      (response) => {
        setMatchsData(response.data);
        setExpand(response.data.length);
        setLoading(false);
      }
    );
    // eslint-disable-next-line
  }, [dateFilter, favoritesChamp]);

  useEffect(() => {
    const timer = setTimeout(() => {
      MatchDataService.getMatchsByDate(dateFilter, favoritesChamp).then(
        (response) => {
          setMatchsData(response.data);
        }
      );
    }, 30000);
    return () => clearTimeout(timer);
  });

  const changeDate = (dateChange) => {
    setDateFilter(dateChange);
    if (dateChange !== getTodayDate(0)) {
      setButtonChange({ all: true, live: false, finished: false, next: false });
      setFilterSelected("");
    }
  };

  const changeSelected = (buttonName) => {
    if (buttonName === "all") {
      setButtonChange({ all: true, live: false, finished: false, next: false });
      setFilterSelected("");
    } else if (buttonName === "live") {
      setButtonChange({ all: false, live: true, finished: false, next: false });
      setFilterSelected("AO VIVO");
    } else if (buttonName === "finished") {
      setButtonChange({ all: false, live: false, finished: true, next: false });
      setFilterSelected("ENCERRADO");
    } else {
      setButtonChange({ all: false, live: false, finished: false, next: true });
      setFilterSelected("A REALIZAR");
    }
  };

  const setExpand = (length) => {
    const array = [];
    for (let index = 0; index < length; index++) {
      array.push({ i: index, value: true });
    }
    setButtonExpand(array);
  };

  const changeExpand = (key) => {
    setButtonExpand(
      buttonExpand.map((item) => {
        if (item.i === key && item.value === true)
          return { i: key, value: false };
        else if (item.i === key && item.value === false)
          return { i: key, value: true };

        return item;
      })
    );
  };

  const haveChampionships = (data) => {
    let count = 0;
    for (let i = 0; i < data?.length; i++) {
      for (let j = 0; j < data[i]?.matchs?.length; j++) {
        if (
          filterSelected === "" ||
          data[i].matchs[j].status === filterSelected
        ) {
          return true;
        }
      }
    }

    if (count === 0) {
      return false;
    }
  };

  const haveMatchs = (championship) => {
    let count = 0;
    for (let index = 0; index < championship.matchs.length; index++) {
      if (
        filterSelected === "" ||
        championship.matchs[index].status === filterSelected
      ) {
        return true;
      }
    }

    if (count === 0) {
      return false;
    }
  };

  const checkLastEvent = (match) => {
    let event = "";
    if (match.events?.length > 0) {
      let timeLastEvent = parseInt(
        match.events[match.events?.length - 1].time.replace("'", "")
      );
      let timeMatch = parseInt(match.time.replace("MIN", ""));

      if (
        match.events[match.events.length - 1].type === "GOAL" &&
        timeMatch <= timeLastEvent + 2
      ) {
        event = "GOL";
      }
    }

    return event;
  };

  const changeMinMatch = (match) => {
    let time;
    if (match?.time === "INTERVALO")
      time = match?.time?.replace("INTERVALO", "INT");
    else if (match?.time === "SUSPENSO")
      time = match?.time?.replace("SUSPENSO", "SUSP");
    else if (match?.time === "ADIADO")
      time = match?.time?.replace("ADIADO", "CANC");
    else if (match?.time === "ATRASADO")
      time = match?.time?.replace("ATRASADO", "ATRA");
    else if (match?.time === "INTERROMPIDO")
      time = match?.time?.replace("INTERROMPIDO", "SUSP");
    else if (match?.time === "PÊNALTIS")
      time = match?.time?.replace("PÊNALTIS", "PEN");
    else time = match?.time?.replace(" MIN", "'");

    return time;
  };

  return (
    <Container id="container-results">
      <div className="button-group-results">
        <Button
          className={
            buttonChange.all ? "button-filter-selected" : "button-filter"
          }
          title="Todos"
          onClick={() => changeSelected("all")}
        >
          TODOS
        </Button>
        <Button
          className={
            buttonChange.live ? "button-filter-selected" : "button-filter"
          }
          title="Ao vivo"
          onClick={() => changeSelected("live")}
          disabled={getTodayDate(0) !== dateFilter}
        >
          AO VIVO
        </Button>
        <Button
          className={
            buttonChange.next ? "button-filter-selected" : "button-filter"
          }
          title="Próximos"
          onClick={() => changeSelected("next")}
          disabled={getTodayDate(0) !== dateFilter}
        >
          PRÓXIMOS
        </Button>
        <Button
          className={
            buttonChange.finished ? "button-filter-selected" : "button-filter"
          }
          title="Finalizado"
          onClick={() => changeSelected("finished")}
          disabled={getTodayDate(0) !== dateFilter}
        >
          FINALIZADOS
        </Button>
        <select
          onChange={(e) => changeDate(e.target.value)}
          className="form-results"
          value={dateFilter}
        >
          <option value={getTodayDate(-3)}>{getFilterSelect(-3)}</option>
          <option value={getTodayDate(-2)}>{getFilterSelect(-2)}</option>
          <option value={getTodayDate(-1)}>{getFilterSelect(-1)}</option>
          <option value={getTodayDate(0)} label="Hoje">
            {getFilterSelect(0)}
          </option>
          <option value={getTodayDate(1)}>{getFilterSelect(1)}</option>
          <option value={getTodayDate(2)}>{getFilterSelect(2)}</option>
          <option value={getTodayDate(3)}>{getFilterSelect(3)}</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner-results">
          <Spinner animation="border" />
        </div>
      ) : matchsData?.length === 0 ? (
        <div className="results-section_title">
          <span>NENHUMA PARTIDA ENCONTRADA PARA O DIA {dateFilter}</span>
        </div>
      ) : haveChampionships(matchsData) ? (
        matchsData?.map((championship, i) =>
          haveMatchs(championship) ? (
            <div key={i} style={{ margin: "2px" }}>
              <div className="championship-results">
                <Col
                  md={1}
                  sm={1}
                  xs={1}
                  className="col-championship-results col-first-results"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      changeExpand(i);
                    }}
                    className="button-championship-results"
                  >
                    {buttonExpand[i]?.value ? (
                      <MdOutlineKeyboardArrowUp />
                    ) : (
                      <MdOutlineKeyboardArrowDown />
                    )}
                  </button>
                </Col>
                <Col
                  md={10}
                  sm={10}
                  xs={10}
                  className="col-championship-results"
                >
                  {championship.matchs[0].idChampionship !== "" ? (
                    <Link
                      to={`/campeonato/${championship.matchs[0].idChampionship}`}
                      className="link-results"
                    >
                      <span className="text-championship-results">
                        {championship._id.championship}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-championship-results">
                      {championship._id.championship}
                    </span>
                  )}
                </Col>
                <Col
                  md={1}
                  sm={1}
                  xs={1}
                  className="col-championship-results"
                ></Col>
              </div>

              {buttonExpand[i]?.value ? (
                championship?.matchs.map((match, i) =>
                  filterSelected === "" || match.status === filterSelected ? (
                    <Link
                      to={`/partida/${match.idMatch}`}
                      className="link-results"
                      key={i}
                    >
                      <ListGroup className="match">
                        <Col
                          md={1}
                          sm={1}
                          xs={1}
                          className="align-results col-first-results"
                        >
                          {match?.status === "AO VIVO" ? (
                            <span className="matchs-text-results">
                              {changeMinMatch(match)}
                            </span>
                          ) : match?.status === "ENCERRADO" ? (
                            <span className="matchs-text-results">FIM</span>
                          ) : (
                            <span className="matchs-text-results">
                              {match.schedule}
                            </span>
                          )}
                        </Col>
                        <Col
                          className="align-team-home-results"
                          md={3}
                          sm={3}
                          xs={3}
                        >
                          <span className="matchs-text-results name-team-results">
                            {match.teams?.homeName}
                          </span>
                        </Col>
                        <Col className="align-results" md={1} sm={1} xs={1}>
                          <img
                            className="img-results"
                            src={match.teams?.homeImg}
                            alt={`${match.teams?.homeName}`}
                            title={`${match.teams?.homeName}`}
                          />
                        </Col>
                        <Col className="align-results" md={2} sm={2} xs={2}>
                          <Col className="align-results" md={5} sm={5} xs={5}>
                            <span className="match-number-results">
                              {match.scoreHome}
                            </span>
                          </Col>
                          <Col className="align-results" md={2} sm={2} xs={2}>
                            <span className="match-results">-</span>
                          </Col>
                          <Col className="align-results" md={5} sm={5} xs={5}>
                            <span className="match-number-results">
                              {match.scoreAway}
                            </span>
                          </Col>
                        </Col>
                        <Col className="align-results" md={1} sm={1} xs={1}>
                          <img
                            className="img-results"
                            src={match.teams?.awayImg}
                            alt={`${match.teams?.awayName}`}
                            title={`${match.teams?.awayName}`}
                          />
                        </Col>
                        <Col
                          className="align-team-away-results"
                          md={3}
                          sm={3}
                          xs={3}
                        >
                          <span className="matchs-text-results name-team-results">
                            {match.teams?.awayName}
                          </span>
                        </Col>
                        <Col className="align-results" md={1} sm={1} xs={1}>
                          {match.status === "AO VIVO" &&
                            checkLastEvent(match) !== "" && (
                              <GiSoccerBall className="goal-effect-results" />
                            )}
                        </Col>
                      </ListGroup>
                      {i !== championship?.matchs.length - 1 ? (
                        <hr className="border-match" />
                      ) : (
                        <></>
                      )}
                    </Link>
                  ) : (
                    <Fragment key={i}></Fragment>
                  )
                )
              ) : (
                <></>
              )}
            </div>
          ) : (
            <Fragment key={i}></Fragment>
          )
        )
      ) : filterSelected === "ENCERRADO" ? (
        <div className="results-section_title">
          <span>NENHUMA PARTIDA ENCERRADA PARA O DIA {dateFilter}</span>
        </div>
      ) : (
        <div className="results-section_title">
          <span>
            NENHUMA PARTIDA {filterSelected} PARA O DIA {dateFilter}
          </span>
        </div>
      )}
    </Container>
  );
}

export default Results;
