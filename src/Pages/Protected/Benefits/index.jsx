import { useEffect, useState, useContext } from "react";
import AuthContext, { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import { APIUsers } from "../../../Services/BaseService";
import SecondaryButton from "../../../Components/SecondaryButton";
import sindpol_logo from "../../../assets/sindpol-logo.png";
import sentinela_logo from "../../../assets/sentinela-logo.png";

import "./index.css";

const Benefits = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useAuth();
  const storagedUserString = localStorage.getItem("@App:user");
  const storagedUser = JSON.parse(storagedUserString);

  const [nome, setNome] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await APIUsers.get(`users/${storagedUser.user._id}`, {
          headers: { Authorization: `Bearer ${storagedUser.token}` },
        });
        setNome(response.data.name);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  });

  const handleBenefitsList = () => {
    navigate("/beneficios/lista");
  };

  const handleBenefitsCreate = () => {
    navigate("/beneficios/criar");
  };

  return (
    user && (
      <section className="container">
        <div className="area-hub">
          <div className="card-benefits">
            <img className="logo" src={sindpol_logo} alt="Sindpol Logo" />
            <img
              className="sentinela"
              src={sentinela_logo}
              alt="Sentinela Logo"
            />
            <div className="hub-btn">
            <SecondaryButton
              text="CADASTRO DE CONVENIO"
              onClick={handleBenefitsCreate}
            />
            <SecondaryButton
              text="LISTA DE CONVENIO"
              onClick={handleBenefitsList}
            />
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default Benefits;

