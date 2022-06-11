import saleImg from "../assets/jpg/saleImg.jpg";
import rentImg from "../assets/jpg/rentImg.jpg";
import { Container, Row, Image, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Container className="mt-5" fluid="md">
      <header>
        <p className="pageHeader">Find Ideal Place For You</p>
      </header>
      <main>
        <p className="landing-page-paragraf">Suggested</p>
        <p className="landing-page-paragraf" style={{ marginTop: "50px" }}>
          Category
        </p>
        <Container>
          <Row className="ctg-row">
            <Col onClick={() => navigate("/category/sell")}>
              <Image fluid rounded src={saleImg} alt="sale" />
              {/* <p className="category-title">Nekretnine za prodaju</p> */}
            </Col>
            <Col onClick={() => navigate("/category/rent")}>
              <Image fluid rounded src={rentImg} alt="rent" />
              {/* <p className="category-title">Nekretnine za najam</p> */}
            </Col>
          </Row>
        </Container>
      </main>
    </Container>
  );
};

export default LandingPage;
