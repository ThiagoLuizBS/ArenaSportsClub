import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function Match() {
  const [listMatch, setListMatch] = useState([{}]);
  const [buttonChange, setButtonChange] = useState({
    sumario: true,
    estatistica: false,
    formacao: false,
  });

  const changeSelected = (buttonName) => {
    console.log(buttonChange);
    if (buttonName === "buttonSum") {
      setButtonChange({ sumario: true, estatistica: false, formacao: false });
    } else if (buttonName === "buttonFor") {
      setButtonChange({ sumario: false, estatistica: false, formacao: true });
    } else {
      setButtonChange({ sumario: false, estatistica: true, formacao: false });
    }
    console.log(buttonChange);
  };

  useEffect(() => {
    fetch("/partida")
      .then((response) => response.json())
      .then((data) => {
        setListMatch(data);
      });
  }, []);

  return (
    <Container>
      <div>
        <div className="top-nameCamp">
          {typeof listMatch.partida === "undefined" ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="nameCamp">
                <h1>{listMatch.partida[0].nomeCampeonato}</h1>
              </div>
              <Row md={12} style={{ margin: 0 }}>
                <div className="content-match">
                  <Col
                    md={3}
                    id="col-content-match"
                    style={{ textAlign: "center" }}
                  >
                    <img
                      src={listMatch.partida[0].imgUrlCasa}
                      alt={`${listMatch.partida[0].equipeCasa}`}
                      width="128px"
                    />
                    <h3 className="teams-name">
                      {" "}
                      {listMatch.partida[0].equipeCasa}{" "}
                    </h3>
                  </Col>
                  <Col md={6} style={{ textAlign: "center" }}>
                    <h1>
                      {listMatch.partida[0].placarCasa} X{" "}
                      {listMatch.partida[0].placarFora}{" "}
                    </h1>
                  </Col>
                  <Col
                    md={3}
                    id="col-content-match"
                    style={{ textAlign: "center" }}
                  >
                    <img
                      src={listMatch.partida[0].imgUrlFora}
                      alt={`${listMatch.partida[0].equipeFora}`}
                      width="128px"
                    />
                    <h3 className="teams-name">
                      {" "}
                      {listMatch.partida[0].equipeFora}
                    </h3>
                  </Col>

                  <p className="datas">{listMatch.partida[0].data}</p>

                  <div className="button-group-match">
                    <Button
                      id={
                        buttonChange.sumario
                          ? "button-match-selected"
                          : "button-match"
                      }
                      title="Sumário"
                      onClick={() => changeSelected("buttonSum")}
                    >
                      SUMÁRIO
                    </Button>
                    <Button
                      id={
                        buttonChange.estatistica
                          ? "button-match-selected"
                          : "button-match"
                      }
                      title="Estatísticas"
                      onClick={() => changeSelected("buttonEst")}
                    >
                      ESTATÍSTICAS
                    </Button>
                    <Button
                      id={
                        buttonChange.formacao
                          ? "button-match-selected"
                          : "button-match"
                      }
                      title="Formação"
                      onClick={() => changeSelected("buttonFor")}
                    >
                      FORMAÇÃO
                    </Button>
                  </div>
                </div>
              </Row>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
