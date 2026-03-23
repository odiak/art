import styled from "@emotion/styled";
import { Link } from "react-router";

const Container = styled.main`
  padding: 8px;
`;

export default function Home() {
  return (
    <Container>
      <h1>Digital arts by odiak</h1>
      <ul>
        <li>
          <Link to="/snow">Snow</Link>
        </li>
        <li>
          <Link to="/untitled1">Untitled 1</Link>
        </li>
      </ul>
    </Container>
  );
}
