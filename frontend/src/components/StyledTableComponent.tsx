import React from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
  width: auto;
  margin: 30px auto 30px 0;
  border-spacing: 0;
  table-layout: auto;
  border: 2px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledThead = styled.thead`
  th {
    padding: 10px 20px;
    text-align: left;
    border-bottom: 2px solid #ccc;
    border-right: 1px solid #ccc;
  }

  th:last-child {
    border-right: none;
  }
`;

const StyledTbody = styled.tbody`
  td {
    padding: 8px 20px;
    text-align: left;
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  td:last-child {
    border-right: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

interface TableData {
  [key: string]: string;
}

function StyledTableComponent({ columns, datas }: { columns: string[]; datas: TableData[] }) {
  return (
    <StyledTable>
      <StyledThead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </StyledThead>
      <StyledTbody>
        {datas.map((data, index) => (
          <tr key={index}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>{data[column]}</td>
            ))}
          </tr>
        ))}
      </StyledTbody>
    </StyledTable>
  );
}

export default StyledTableComponent;
