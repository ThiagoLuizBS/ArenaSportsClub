import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Container, Button, Col } from "react-bootstrap";
import MatchDataService from "../services/match.js";
import "../styles/pages/Predictions.css";

export function Predictions() {
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
    date = date.replace("-2023", "");
    return date;
  };

  const [matchsData, setMatchsData] = useState([]);
  const [dateFilter, setDateFilter] = useState(getTodayDate(0));
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("inline-radio1-0");
  const [matchSelected, setMatchSelected] = useState("");
  const [matchsCounter, setMatchsCounter] = useState("inline-radio2-5");
  const statisticsList = [
    "Posse de bola",
    "Total de passes",
    "Passes corretos",
    "Total de chutes",
    "Chutes no gol",
    "Escanteios",
    "Faltas cometidas",
  ];
  const statisticsChampionshipList = [
    "Posição",
    "Pts/J/V/E/D",
    "GM/GS/SG",
    "xG/xGA/xGD",
    "Sh/SoT/SoT%",
    "GSh/GSoT",
    "Poss/Cmp/Cmpp",
    "PrgC/PrgP",
    "Faltas cometidas",
    "Cartões amarelos e vermelhos",
    "Clean Sheets",
    "Escanteios cobrados",
    "Idade média do elenco",
    "Salário do elenco",
    "Público médio",
  ];

  const [statisticsSelected, setStatisticsSelected] = useState(statisticsList);
  const [statisticsChampionshipSelected, setStatisticsChampionshipSelected] =
    useState(statisticsChampionshipList);
  const [error, setError] = useState("");

  const modelsList = ["gpt-3.5", "gpt-4", "gpt-4o"];

  const changeStatisticsSelected = (event) => {
    if (event.target.checked)
      setStatisticsSelected((prev) => [...prev, event.target.id]);
    else {
      const newStatisticsSelected = statisticsSelected.filter(
        (value) => value !== event.target.id
      );
      setStatisticsSelected(newStatisticsSelected);
    }
  };

  const changeStatisticsChampionshipSelected = (event) => {
    if (event.target.checked)
      setStatisticsChampionshipSelected((prev) => [...prev, event.target.id]);
    else {
      const newStatisticsSelected = statisticsChampionshipSelected.filter(
        (value) => value !== event.target.id
      );
      setStatisticsChampionshipSelected(newStatisticsSelected);
    }
  };

  useEffect(() => {
    MatchDataService.getMatchsByDate(dateFilter, []).then((response) => {
      setMatchsData(response.data);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [dateFilter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (model === "") setError("Preencha todos os campos!");
    else {
      //   UserDataService.getUser(email, password)
      //     .then((response) => {
      //       setError("");
      //       handleLogin(response.data.token, response.data.idUser);
      //       setShowToast(true);
      //       setToastMessage(`Seja bem vindo ${response.data.nameUser}!`);
      //     })
      //     .catch((response) => setError(response.response.data.error));
    }
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
    <Container>
      <div className="predictions-container">
        <h1>Previsão de partidas</h1>

        <h5>
          Selecione a partida e as informações que serão utilizadas para gerar a
          previção
        </h5>

        <Form onSubmit={handleSubmit} className="my-4">
          <Form.Group className="mb-3" controlId="formBasicSelect1">
            <Form.Select
              aria-label="selectMatch"
              value={matchSelected}
              onChange={(event) => setMatchSelected(event.target.value)}
            >
              <option value="" disabled hidden>
                Selecione uma partida
              </option>

              {matchsData?.map((championship, index) =>
                championship?.matchs.map((match, i) => (
                  <option key={`${index}-${i}`} value={match.idMatch}>
                    {`${championship._id.championship} - `}
                    {match?.status === "AO VIVO"
                      ? `${changeMinMatch(match)}`
                      : match?.status === "ENCERRADO"
                      ? `FIM`
                      : `${match.schedule}`}
                    {` - ${match.teams?.homeName} ${match.scoreHome} - ${match.scoreAway} ${match.teams?.awayName}`}
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>

          <div className="row-statistics-predictions">
            <Col md={2} sm={10} xs={10}>
              <Form.Group className="mb-3" controlId="formBasicRadio1">
                <Form.Label className="me-4 bold">Modelo</Form.Label>

                <div className="rows-radio-1">
                  {modelsList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio1"
                      type="radio"
                      checked={model === `inline-radio1-${i}`}
                      onChange={(event) => setModel(event.target.id)}
                      id={`inline-radio1-${i}`}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={3} sm={10} xs={10}>
              <Form.Group className="mb-3" controlId="formBasicRadio2">
                <Form.Label className="me-4 bold">
                  Número de partidas no histórico
                </Form.Label>

                <div className="rows-radio-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio2"
                      type="radio"
                      checked={matchsCounter === `inline-radio2-${i}`}
                      onChange={(event) => setMatchsCounter(event.target.id)}
                      id={`inline-radio2-${i}`}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={3} sm={10} xs={10}>
              <Form.Group className="mb-3" controlId="formBasicCheckbox1">
                <Form.Label className="me-4 bold">
                  Estatísticas das partidas
                </Form.Label>

                <div className="rows-radio-1">
                  {statisticsList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name={item}
                      type="checkbox"
                      checked={statisticsSelected.some(
                        (value) => value === item
                      )}
                      onChange={(event) => changeStatisticsSelected(event)}
                      id={item}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={3} sm={10} xs={10}>
              <Form.Group className="mb-3" controlId="formBasicCheckbox2">
                <Form.Label className="me-4 bold">
                  Estatísticas do campeonato
                </Form.Label>

                <div className="rows-radio-1">
                  {statisticsChampionshipList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name={item}
                      type="checkbox"
                      checked={statisticsChampionshipSelected.some(
                        (value) => value === item
                      )}
                      onChange={(event) =>
                        changeStatisticsChampionshipSelected(event)
                      }
                      id={item}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </div>

          <Form.Label className="error-login">{error}</Form.Label>

          <div className="button-predict">
            <Button variant="success" type="submit">
              Gerar previsão
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
