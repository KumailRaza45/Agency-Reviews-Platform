import React from "react";
import "./table.css";
import { formatDate } from "../../Utilities/utilities";

export default function Table(props) {
  const { header, rows } = props;
  return (
    <div className="table-container">
      <table id="customers">
        <tr>
          {header.map((head, index) => {
            return (
              <div
                className="th"
                style={{
                  minWidth:
                    typeof head.width === "string"
                      ? head.width
                      : `calc(100% - ${head.width}px)`,
                  maxWidth:
                    typeof head.width === "string"
                      ? head.width
                      : `calc(100% - ${head.width}px)`,
                }}
              >
                <span>{head?.title || "column"}</span>
              </div>
            );
          })}
        </tr>
        {rows.map((row, _) => {
          return (
            <tr key={_}>
              {header.map((head, _i) => {
                let date = "";
                if (head.name === "created_at" || head.name === "date") {
                  date = new Date(row[`${head.name}`]);

                  var day = date.getUTCDate();
                  var month = date.getUTCMonth() + 1;
                  var year = date.getUTCFullYear();
                  date = `${month < 10 ? "0" : ""}${month}-${
                    day < 10 ? "0" : ""
                  }${day}-${year}`;
                }

                return (
                  <div
                    className="td custom-scroll-bar"
                    style={{
                      margin: 0,
                      minWidth:
                        typeof head.width === "string"
                          ? head.width
                          : `calc(100% - ${head.width}px)`,
                      maxWidth:
                        typeof head.width === "string"
                          ? head.width
                          : `calc(100% - ${head.width}px)`,
                      maxHeight: head?.maxHeight || "min-content",
                      overflowY: head?.maxHeight ? "scroll" : "none",
                    }}
                  >
                    {head.type === "link" ? (
                      // eslint-disable-next-line react/jsx-no-target-blank
                      <a
                        style={{ textDecoration: "underline", color: "blue" }}
                        href={`https://${row[`${head.name}`]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >{`${row[`${head.name}`]}`}</a>
                    ) : head.type === "textarea" ? (
                      <pre
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          minHeight: "100%",
                          padding: "0px",
                          height: "min-content",
                          maxHeight: "min-content",
                          overflow: "hidden",
                        }}
                      >
                        {row[`${head.name}`]}
                      </pre>
                    ) : (
                      <span>
                        {head.name === "created_at"
                          ? date
                          : row[`${head.name}`]}
                      </span>
                    )}
                  </div>
                );
              })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}
