import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Container, Button, Col, Spinner } from "react-bootstrap";
import MatchDataService from "../services/match.js";
import "../styles/pages/Predictions.css";
import previsionService from "../services/prevision.js";

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
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [language, setLanguage] = useState("Português");
  const [shotsLearning, setShotsLearning] = useState("One-shot");
  const [matchSelected, setMatchSelected] = useState("11531");
  const [matchsCounter, setMatchsCounter] = useState(6);
  const statisticsList = [
    "Posse de bola (%)",
    "Total de passes",
    "Passes corretos (%)",
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
    "Poss/Cmp/Cmpp",
    "PrgC/PrgP",
    "Faltas cometidas",
    "Cartões amarelos e vermelhos",
    "Clean Sheets",
    "Escanteios cobrados",
    "Idade média do elenco",
    "Salário do elenco",
  ];

  const [statisticsSelected, setStatisticsSelected] = useState([]);
  const [statisticsChampionshipSelected, setStatisticsChampionshipSelected] =
    useState([]);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");

  const modelsList = ["gpt-3.5-turbo", "gpt-4", "gpt-4o"];
  const languagesList = ["Português", "Inglês"];
  const shotsLearningsList = ["Zero-shot", "One-shot", "Three-shots"];

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
    console.log(
      matchSelected,
      model,
      language,
      shotsLearning,
      matchsCounter,
      statisticsSelected,
      statisticsChampionshipSelected
    );
    if (matchSelected === "")
      setError("Selecione uma partida antes de realizar a previsão!");
    else {
      setResponse("");
      previsionService
        .getPrevision({
          model,
          language,
          shotsLearning,
          matchsCounter,
          statisticsSelected,
          statisticsChampionshipSelected,
          matchSelected,
        })
        .then((response) => {
          setError("");
          setResponse(response.data.data);
        })
        .catch((response) => setError(response.response.data.error));
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
                      checked={model === item}
                      onChange={(event) => setModel(event.target.id)}
                      id={item}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicRadio3">
                <Form.Label className="me-4 bold">
                  Linguagem utilizada
                </Form.Label>

                <div className="rows-radio-1">
                  {languagesList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio3"
                      type="radio"
                      checked={language === item}
                      onChange={(event) => setLanguage(event.target.id)}
                      id={item}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicRadio4">
                <Form.Label className="me-4 bold">
                  Número de exemplos para o modelo
                </Form.Label>

                <div className="rows-radio-1">
                  {shotsLearningsList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio4"
                      type="radio"
                      checked={shotsLearning === item}
                      onChange={(event) => setShotsLearning(event.target.id)}
                      id={item}
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
                      checked={matchsCounter === item}
                      onChange={(event) => setMatchsCounter(+event.target.id)}
                      id={item}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={3} sm={10} xs={10}>
              <Form.Group className="mb-3" controlId="formBasicCheckbox1">
                <Form.Label className="me-4 bold">
                  Estatísticas das partidas (Max 5)
                </Form.Label>

                <div className="rows-radio-1">
                  {statisticsList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      disabled={
                        statisticsSelected.length > 4 &&
                        !statisticsSelected.some((value) => value === item)
                      }
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
                  Estatísticas do campeonato (Max 5)
                </Form.Label>

                <div className="rows-radio-1">
                  {statisticsChampionshipList.map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name={item}
                      disabled={
                        statisticsChampionshipSelected.length > 4 &&
                        !statisticsChampionshipSelected.some(
                          (value) => value === item
                        )
                      }
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

      {response !== "" ? (
        <div className="prevision-results" style={{ margin: "16px 0" }}>
          <h1>{response.prevision.split("\n")[0]}</h1>

          <div>
            <span>Vitória</span>
            <span>Empate</span>
            <span>Vitória</span>
          </div>

          <div>
            <span>
              {response.prevision.split("\n")[1].split("|")[0].match(/\d+/)}%
            </span>
            <span>
              {response.prevision.split("\n")[1].split("|")[1].match(/\d+/)}%
            </span>
            <span>
              {response.prevision.split("\n")[1].split("|")[2].match(/\d+/)}%
            </span>
          </div>

          {/* <div>
            <span>{response.matchPresentation}</span>
            <span>{response.homeMatchsPresentation}</span>
            <span>{response.awayMatchsPresentation}</span>
          </div> */}
        </div>
      ) : (
        <div
          className="spinner-results"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" />
          <span style={{ margin: "0 16px" }}>
            Aguardando geração da previsão
          </span>
        </div>
      )}
    </Container>
  );
}
