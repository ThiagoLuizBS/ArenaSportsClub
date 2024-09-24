import React, { useState, Fragment, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Container, Button, Col, Spinner, ListGroup } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import previsionService from "../services/prevision.js";
import MatchDataService from "../services/match.js";
import "../styles/pages/Predictions.css";

export function Predictions() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  let { id } = useParams();
  const [listMatch, setListMatch] = useState([]);

  const [model, setModel] = useState("gpt-3.5-turbo");
  const [shotsLearning, setShotsLearning] = useState("One-shot");
  const [historicType, setHistoricType] = useState("Todas");
  const [statisticsType, setStatisticsType] = useState("Por partida");
  const [temperature, setTemperature] = useState("1");
  const [matchsCounter, setMatchsCounter] = useState(6);
  const [statisticsSelected, setStatisticsSelected] = useState([]);
  const [statisticsChampionshipSelected, setStatisticsChampionshipSelected] =
    useState([]);

  const modelsList = ["gpt-3.5-turbo", "gpt-4", "gpt-4o"];
  const shotsLearningsList = ["Zero-shot", "One-shot", "Three-shots"];

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

  useEffect(() => {
    if (!!id)
      MatchDataService.getMatch(id).then((response) =>
        setListMatch(response.data[0])
      );
  }, [id]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!!!id) setError("Selecione uma partida antes de realizar a previsão!");
    else {
      setLoading(true);
      setResponse("");
      await previsionService
        .getPrevision({
          model,
          shotsLearning,
          matchsCounter,
          statisticsSelected,
          statisticsChampionshipSelected,
          historicType,
          statisticsType,
          temperature,
          matchSelected: id,
        })
        .then((response) => {
          setError("");
          setResponse(response.data);
        })
        .catch((response) => setError(response.response.data.error))
        .finally(() => setLoading(false));
    }
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
          <div className="button-predict mb-4">
            {!!id ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    margin: "2px",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <ListGroup className="match">
                    <Col
                      md={1}
                      sm={1}
                      xs={1}
                      className="align-results col-first-results"
                    >
                      {listMatch?.status === "AO VIVO" ? (
                        <span className="matchs-text-results">
                          {changeMinMatch(listMatch)}
                        </span>
                      ) : listMatch?.status === "ENCERRADO" ? (
                        <span className="matchs-text-results">FIM</span>
                      ) : (
                        <span className="matchs-text-results">
                          {listMatch.schedule}
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
                        {listMatch.teams?.homeName}
                      </span>
                    </Col>
                    <Col className="align-results" md={1} sm={1} xs={1}>
                      <img
                        className="img-results"
                        src={listMatch.teams?.homeImg}
                        alt={`${listMatch.teams?.homeName}`}
                        title={`${listMatch.teams?.homeName}`}
                      />
                    </Col>

                    <Col className="align-results" md={2} sm={2} xs={2}>
                      <Col className="align-results" md={5} sm={5} xs={5}>
                        <span className="match-number-results">
                          {listMatch.scoreHome}
                        </span>
                      </Col>
                      <Col className="align-results" md={2} sm={2} xs={2}>
                        <span className="match-results">-</span>
                      </Col>
                      <Col className="align-results" md={5} sm={5} xs={5}>
                        <span className="match-number-results">
                          {listMatch.scoreAway}
                        </span>
                      </Col>
                    </Col>

                    <Col className="align-results" md={1} sm={1} xs={1}>
                      <img
                        className="img-results"
                        src={listMatch.teams?.awayImg}
                        alt={`${listMatch.teams?.awayName}`}
                        title={`${listMatch.teams?.awayName}`}
                      />
                    </Col>
                    <Col
                      className="align-team-away-results"
                      md={3}
                      sm={3}
                      xs={3}
                    >
                      <span className="matchs-text-results name-team-results">
                        {listMatch.teams?.awayName}
                      </span>
                    </Col>
                    <Col
                      md={1}
                      sm={1}
                      xs={1}
                      className="align-results col-first-results"
                    ></Col>
                  </ListGroup>
                </div>

                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="success"
                    onClick={() => window.history.back()}
                  >
                    Voltar
                  </Button>

                  <Link to={`/`} className="link-results">
                    <Button variant="success">Selecionar outra partida</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Link to={`/`} className="link-results">
                <Button variant="success">Selecionar uma partida</Button>
              </Link>
            )}
          </div>

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
                      disabled
                      onChange={(event) => setModel(event.target.id)}
                      id={item}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicRadio4">
                <Form.Label className="me-4 bold">Temperatura</Form.Label>

                <div className="rows-radio-1">
                  {["0", "1", "2"].map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio6"
                      type="radio"
                      checked={temperature === item}
                      onChange={(event) => setTemperature(event.target.id)}
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

              <Form.Group className="mb-3" controlId="formBasicRadio4">
                <Form.Label className="me-4 bold">
                  Histórico de partidas a serem analisadas
                </Form.Label>

                <div className="rows-radio-1">
                  {["Todas", "Apenas mandante ou visitante"].map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio5"
                      type="radio"
                      checked={historicType === item}
                      onChange={(event) => setHistoricType(event.target.id)}
                      id={item}
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
                      // disabled={
                      //   statisticsSelected.length > 4 &&
                      //   !statisticsSelected.some((value) => value === item)
                      // }
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

              <Form.Group className="mb-3" controlId="formBasicCheckbox1">
                <Form.Label className="me-4 bold">
                  Apresentação das estatísticas
                </Form.Label>

                <div className="rows-radio-1">
                  {["Por partida", "Por média"].map((item, i) => (
                    <Form.Check
                      key={i}
                      inline
                      label={item}
                      name="radio7"
                      type="radio"
                      checked={statisticsType === item}
                      onChange={(event) => setStatisticsType(event.target.id)}
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
                      // disabled={
                      //   statisticsChampionshipSelected.length > 4 &&
                      //   !statisticsChampionshipSelected.some(
                      //     (value) => value === item
                      //   )
                      // }
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

          <div className="button-predict">
            <Button variant="success" type="submit">
              Gerar previsão
            </Button>
          </div>

          <Form.Label
            className="error-login my-2"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {error}
          </Form.Label>
        </Form>
      </div>

      {response !== "" ? (
        <div>
          <div
            style={{ margin: "2px", display: "flex", flexDirection: "column" }}
          >
            <div className="championship-results">
              <Link
                target="_blank"
                to={`/campeonato/${response.data.idChampionship}`}
                className="link-results"
              >
                <span className="text-championship-results">
                  {response.data.championship.name}
                </span>
              </Link>
            </div>

            <Link
              target="_blank"
              to={`/partida/${response.data.match.idMatch}`}
              className="link-results"
            >
              <ListGroup className="match">
                <Col className="align-team-home-results" md={3} sm={3} xs={3}>
                  <span className="matchs-text-results name-team-results">
                    {response.data.match.teams?.homeName}
                  </span>
                </Col>
                <Col className="align-results" md={1} sm={1} xs={1}>
                  <img
                    className="img-results"
                    src={response.data.match.teams?.homeImg}
                    alt={`${response.data.match.teams?.homeName}`}
                    title={`${response.data.match.teams?.homeName}`}
                  />
                </Col>
                <Col className="align-results" md={2} sm={2} xs={2}>
                  <Col className="align-results" md={2} sm={2} xs={2}>
                    <span className="match-results">-</span>
                  </Col>
                </Col>
                <Col className="align-results" md={1} sm={1} xs={1}>
                  <img
                    className="img-results"
                    src={response.data.match.teams?.awayImg}
                    alt={`${response.data.match.teams?.awayName}`}
                    title={`${response.data.match.teams?.awayName}`}
                  />
                </Col>
                <Col className="align-team-away-results" md={3} sm={3} xs={3}>
                  <span className="matchs-text-results name-team-results">
                    {response.data.match.teams?.awayName}
                  </span>
                </Col>
              </ListGroup>
            </Link>

            <ListGroup className="match-prevision">
              <Col className="align-team-home-results" md={4} sm={4} xs={4}>
                <span className="matchs-text-results name-team-results">
                  Vitória
                </span>
              </Col>
              <Col className="align-results" md={4} sm={4} xs={4}>
                <span className="matchs-text-results name-team-results">
                  Empate
                </span>
              </Col>
              <Col className="align-team-away-results" md={4} sm={4} xs={4}>
                <span className="matchs-text-results name-team-results">
                  Vitória
                </span>
              </Col>
            </ListGroup>

            <ListGroup className="match-prevision">
              <Col className="align-team-home-results" md={4} sm={4} xs={4}>
                <span className="matchs-text-results name-team-results">
                  {response.response.prevision
                    .split("\n")[1]
                    .split("|")[0]
                    .match(/\d+/)}
                  %
                </span>
              </Col>
              <Col className="align-results" md={4} sm={4} xs={4}>
                <span className="matchs-text-results name-team-results">
                  {response.response.prevision
                    .split("\n")[1]
                    .split("|")[1]
                    .match(/\d+/)}
                  %
                </span>
              </Col>
              <Col className="align-team-away-results" md={4} sm={4} xs={4}>
                <span className="matchs-text-results name-team-results">
                  {response.response.prevision
                    .split("\n")[1]
                    .split("|")[2]
                    .match(/\d+/)}
                  %
                </span>
              </Col>
            </ListGroup>
          </div>

          <div className="historic-prevision-container">
            <div className="historic-prevision">
              <div className="championship-results">
                <span className="text-championship-results">
                  {response.data.match.teams?.homeName} histórico de partidas
                </span>
              </div>

              {response.data.homeLastMatchs.map((item, i) => (
                <Fragment key={i}>
                  <Link
                    target="_blank"
                    to={`/partida/${item.idMatch}`}
                    className="link-results"
                  >
                    <ListGroup className="match">
                      <Col
                        className="align-team-home-results"
                        md={3}
                        sm={3}
                        xs={3}
                      >
                        <span className="matchs-text-results name-team-results">
                          {item.teams?.homeName}
                        </span>
                      </Col>
                      <Col className="align-results" md={1} sm={1} xs={1}>
                        <img
                          className="img-results"
                          src={item.teams?.homeImg}
                          alt={`${item.teams?.homeName}`}
                          title={`${item.teams?.homeName}`}
                        />
                      </Col>

                      <Col className="align-results" md={2} sm={2} xs={2}>
                        <Col className="align-results" md={5} sm={5} xs={5}>
                          <span className="match-number-results">
                            {item.scoreHome}
                          </span>
                        </Col>
                        <Col className="align-results" md={2} sm={2} xs={2}>
                          <span className="match-results">-</span>
                        </Col>
                        <Col className="align-results" md={5} sm={5} xs={5}>
                          <span className="match-number-results">
                            {item.scoreAway}
                          </span>
                        </Col>
                      </Col>

                      <Col className="align-results" md={1} sm={1} xs={1}>
                        <img
                          className="img-results"
                          src={item.teams?.awayImg}
                          alt={`${item.teams?.awayName}`}
                          title={`${item.teams?.awayName}`}
                        />
                      </Col>
                      <Col
                        className="align-team-away-results"
                        md={3}
                        sm={3}
                        xs={3}
                      >
                        <span className="matchs-text-results name-team-results">
                          {item.teams?.awayName}
                        </span>
                      </Col>
                    </ListGroup>
                  </Link>
                </Fragment>
              ))}
            </div>

            <div className="historic-prevision">
              <div className="championship-results">
                <span className="text-championship-results">
                  {response.data.match.teams?.awayName} histórico de partidas
                </span>
              </div>

              {response.data.awayLastMatchs.map((item, i) => (
                <Fragment key={i}>
                  <Link
                    target="_blank"
                    to={`/partida/${item.idMatch}`}
                    className="link-results"
                  >
                    <ListGroup className="match">
                      <Col
                        className="align-team-home-results"
                        md={3}
                        sm={3}
                        xs={3}
                      >
                        <span className="matchs-text-results name-team-results">
                          {item.teams?.homeName}
                        </span>
                      </Col>
                      <Col className="align-results" md={1} sm={1} xs={1}>
                        <img
                          className="img-results"
                          src={item.teams?.homeImg}
                          alt={`${item.teams?.homeName}`}
                          title={`${item.teams?.homeName}`}
                        />
                      </Col>

                      <Col className="align-results" md={2} sm={2} xs={2}>
                        <Col className="align-results" md={5} sm={5} xs={5}>
                          <span className="match-number-results">
                            {item.scoreHome}
                          </span>
                        </Col>
                        <Col className="align-results" md={2} sm={2} xs={2}>
                          <span className="match-results">-</span>
                        </Col>
                        <Col className="align-results" md={5} sm={5} xs={5}>
                          <span className="match-number-results">
                            {item.scoreAway}
                          </span>
                        </Col>
                      </Col>

                      <Col className="align-results" md={1} sm={1} xs={1}>
                        <img
                          className="img-results"
                          src={item.teams?.awayImg}
                          alt={`${item.teams?.awayName}`}
                          title={`${item.teams?.awayName}`}
                        />
                      </Col>
                      <Col
                        className="align-team-away-results"
                        md={3}
                        sm={3}
                        xs={3}
                      >
                        <span className="matchs-text-results name-team-results">
                          {item.teams?.awayName}
                        </span>
                      </Col>
                    </ListGroup>
                  </Link>
                </Fragment>
              ))}
            </div>
          </div>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Prompts
          </p>

          <p
            style={{
              fontSize: "12px",
              fontWeight: "semibold",
              textAlign: "center",
              color: "red",
            }}
          >
            Caso tenha selecionado algumas estatísticas de campeonato e o prompt
            de campeonatos estiver vazio, isso significa que o campeonato da
            partida selecionada não possui os dados disponíveis na nossa base de
            dados.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              whiteSpace: "pre-line",
            }}
          >
            <span>
              <b>Partida: </b>
              {`${response.prompt.matchPresentation}`}
            </span>
            <span>
              <b>
                {response.data.match.teams?.homeName} histórico de partidas:{" "}
              </b>
              {`${response.prompt.homeMatchsPresentation}`}
            </span>
            <span>
              <b>
                {response.data.match.teams?.awayName} histórico de partidas:{" "}
              </b>
              {response.prompt.awayMatchsPresentation}
            </span>
            <span>
              <b>Campeonato: </b>
              {response.prompt.championshipPresentation}
            </span>
          </div>
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
          {!loading && (
            <span style={{ margin: "0 16px" }}>
              Aguardando geração da previsão
            </span>
          )}
        </div>
      )}
    </Container>
  );
}
