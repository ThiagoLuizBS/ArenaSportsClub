import React from "react";
import { Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../../styles/components/Championship/ButtonTable.css";

function ButtonExtraTable({ actived, championship }) {
  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    actived && (
      <Container id="container-buttonTable">
        {championship?.extraTable?.length > 0 ? (
          <>
            <div className="butTable-section">
              <table>
                <thead className="table-head-color">
                  <tr>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Posição`)}
                      >
                        <span>P</span>
                      </OverlayTrigger>
                    </th>
                    <th>Equipe</th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Pontos`)}
                      >
                        <span>Pts</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Jogos`)}
                      >
                        <span>J</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Vitórias`)}
                      >
                        <span>V</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Empates`)}
                      >
                        <span>E</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Derrotas`)}
                      >
                        <span>D</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols marcados`)
                        }
                      >
                        <span>GM</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols sofridos`)
                        }
                      >
                        <span>GS</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Saldo de gols`)
                        }
                      >
                        <span>SG</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols esperados`)
                        }
                      >
                        <span>xG</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols esperados contra`)
                        }
                      >
                        <span>xGA</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols esperados diferença`)
                        }
                      >
                        <span>xGD</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">Público médio</th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Número de jogadores no elenco`)
                        }
                      >
                        <span>#Pl</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Idade média do elenco`)
                        }
                      >
                        <span>Age</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Média de posse de bola`)
                        }
                      >
                        <span>Poss</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Corridas progressivas`)
                        }
                      >
                        <span>PrgC</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Passes progressivos`)
                        }
                      >
                        <span>PrgP</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Cartões amarelos`)
                        }
                      >
                        <span>YC</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Cartões vermelhos`)
                        }
                      >
                        <span>RD</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) => renderTooltip(props, `Chutes`)}
                      >
                        <span>Sh</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Chutes ao alvo`)
                        }
                      >
                        <span>SoT</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Porcentagem de chutes ao alvo`)
                        }
                      >
                        <span>SoT%</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols por chute`)
                        }
                      >
                        <span>G/Sh</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Gols por chute ao alvo`)
                        }
                      >
                        <span>G/SoT</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Passes completos`)
                        }
                      >
                        <span>Cmp</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(
                            props,
                            `Porcentagem de passes completos`
                          )
                        }
                      >
                        <span>Cmpp</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Média de pontos por partida`)
                        }
                      >
                        <span>Pts/MP</span>
                      </OverlayTrigger>
                    </th>
                    <th id="text-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={(props) =>
                          renderTooltip(props, `Custos de salários semanais`)
                        }
                      >
                        <span>WW</span>
                      </OverlayTrigger>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {championship?.extraTable?.map((scores, i) => (
                    <tr key={i}>
                      <td id="text-point">{i + 1}</td>
                      <td>
                        {scores.team}
                        {scores.notes && `*`}
                      </td>
                      <td id="text-point">{scores.pts}</td>
                      <td id="text-center">{scores.mp}</td>
                      <td id="text-center">{scores.w}</td>
                      <td id="text-center">{scores.d}</td>
                      <td id="text-center">{scores.l}</td>
                      <td id="text-center">{scores.gf}</td>
                      <td id="text-center">{scores.ga}</td>
                      <td id="text-center">{scores.gd}</td>
                      <td id="text-center">{scores.xg}</td>
                      <td id="text-center">{scores.xga}</td>
                      <td id="text-center">{scores.xgd}</td>
                      <td id="text-center">
                        {scores.attendance.replace(",", ".")}
                      </td>
                      <td id="text-center">{scores.npl}</td>
                      <td id="text-center">{scores.age}</td>
                      <td id="text-center">{scores.poss}%</td>
                      <td id="text-center">{scores.prgc}</td>
                      <td id="text-center">{scores.prgp}</td>
                      <td id="text-center">{scores.crdy}</td>
                      <td id="text-center">{scores.crdr}</td>
                      <td id="text-center">{scores.sh}</td>
                      <td id="text-center">{scores.sot}</td>
                      <td id="text-center">{scores.sotp}%</td>
                      <td id="text-center">{scores.gsh}</td>
                      <td id="text-center">{scores.gsot}</td>
                      <td id="text-center">{scores.cmp}</td>
                      <td id="text-center">{scores.cmpp}%</td>
                      <td id="text-center">{scores.ptsmp}</td>
                      <td id="text-center">{scores.ww}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {championship?.extraTable?.map(
                (scores, i) =>
                  scores.notes && (
                    <span key={i} className="butTable-header">
                      {scores.team}: {scores.notes}
                    </span>
                  )
              )}
            </div>
          </>
        ) : (
          <div id="table_Notitle">
            <span>TABELA NÃO DISPONÍVEL</span>
          </div>
        )}
      </Container>
    )
  );
}

export default ButtonExtraTable;
