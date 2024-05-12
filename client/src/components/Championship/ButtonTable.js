import React from "react";
import Container from "react-bootstrap/Container";
import "../../styles/components/Championship/ButtonTable.css";

function ButtonTable({ actived, championship }) {
  return (
    actived && (
      <Container id="container-buttonTable">
        {championship?.table?.length > 0 ? (
          <>
            {typeof championship?.table[0] === "undefined" ? (
              <p>Loading...</p>
            ) : (
              championship?.table?.map((champ, i) => (
                <div className="butTable-section" key={i}>
                  <div className="butTable-header">
                    {champ?.group === "" ? (
                      champ?.phase !== "" ? (
                        <span>{champ.phase}</span>
                      ) : (
                        <span>Classificação</span>
                      )
                    ) : (
                      <div className="butTable-group">
                        {champ.group === "Grupo A" ? (
                          <span className="phase-butTable">{champ.phase}</span>
                        ) : (
                          <></>
                        )}
                        <span> {champ.group} </span>
                      </div>
                    )}
                  </div>
                  <table>
                    <thead className="table-head-color">
                      <tr>
                        <th id="text-center">P</th>
                        <th id="text-value-center">Equipe</th>
                        <th id="text-center">Pontos</th>
                        <th id="text-center">J</th>
                        <th id="text-center">V</th>
                        <th id="text-center">E</th>
                        <th id="text-center">D</th>
                        <th id="text-center">SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {champ?.table.map((scores, i) => (
                        <tr key={i}>
                          <td id="text-point">{i + 1}</td>
                          <td id="text-value-center">{scores.team}</td>
                          <td id="text-point">{scores.points}</td>
                          <td id="text-center">{scores.games}</td>
                          <td id="text-center">{scores.victorys}</td>
                          <td id="text-center">{scores.draws}</td>
                          <td id="text-center">{scores.loses}</td>
                          <td id="text-center">{scores.goaldiference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
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

export default ButtonTable;
