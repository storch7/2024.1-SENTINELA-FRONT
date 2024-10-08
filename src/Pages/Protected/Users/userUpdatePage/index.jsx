import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FieldNumber from "../../../../Components/FieldNumber";
import FieldSelect from "../../../../Components/FieldSelect";
import FieldText from "../../../../Components/FieldText";
import Modal from "../../../../Components/Modal";
import PrimaryButton from "../../../..//Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import {
  deleteUserById,
  getRoles,
  getUserById,
  patchUserById,
} from "../../../../Services/userService";
import "./index.css";

export default function UserUpdatePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userId = state?.userId;

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [celular, setCelular] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [roles, setRoles] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCelularValid, setIsCelularValid] = useState(true);

  const handleNomeCompletoChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    setNomeCompleto(value);
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await getRoles();
        setRoles(roles);
      } catch (error) {
        console.error("Erro ao carregar roles:", error);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const user = await getUserById(userId);
          if (user) {
            setNomeCompleto(user.name || "");
            setCelular(user.phone || "");
            setLogin(user.status ? "Ativo" : "Inativo");
            setEmail(user.email || "");
            setPerfilSelecionado(user.role || "");
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
      }
    };

    fetchUser();
  }, [userId]);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const removeMask = (celular) => celular.replace(/\D/g, "");

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (userId) {
      try {
        await deleteUserById(userId);
        setShowDeletedModal(true);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  const handleSave = async () => {
    const trimmedCelular = removeMask(celular);
    const isValidNumber =
      /^\d+$/.test(trimmedCelular) && trimmedCelular.length > 10;
    const isValidEmailAddress = isValidEmail(email);

    setIsCelularValid(isValidNumber);
    setIsEmailValid(isValidEmailAddress);

    // Verifica se o email é válido antes de salvar
    if (userId && isValidEmailAddress && isValidNumber) {
      const updatedUser = {
        name: nomeCompleto,
        email: email,
        phone: celular,
        status: login === "Ativo",
        role: perfilSelecionado,
      };
      try {
        await patchUserById(userId, updatedUser);
        handleSaveModal();
      } catch (error) {
        console.error(`Erro ao atualizar usuário com ID ${userId}:`, error);
      }
    }
  };

  const loginOptions = ["Ativo", "Inativo"];
  const handleChangeLogin = (event) => {
    setLogin(event.target.value);
  };

  const handlePerfilChange = (event) => {
    setPerfilSelecionado(event.target.value);
  };

  const handleSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleSaveCloseDialog = () => {
    setShowSaveModal(false);
    navigate("/usuarios");
  };

  const handleDeleteCloseDialog = () => {
    setShowDeleteModal(false);
  };

  const handleDeletedCloseDialog = () => {
    setShowDeletedModal(false);
    navigate("/usuarios");
  };

  return (
    <section className="container">
      <div className="forms-container-user">
        <h1>Visualização de usuário</h1>

        <h3>Dados Pessoais</h3>
        <FieldText
          label="Nome Completo"
          value={nomeCompleto}
          onChange={handleNomeCompletoChange}
        />

        <div className="double-box-user">
          <FieldNumber
            label="Celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            format=" (##) ##### ####"
          />

          <FieldSelect
            label="Status"
            value={login}
            onChange={handleChangeLogin}
            options={loginOptions}
          />
        </div>
        {!isCelularValid && (
          <label className="isValid">
            *Verifique se o número de celular inserido está completo
          </label>
        )}
        <FieldText
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isEmailValid && (
          <label className="isValid">*Insira um email válido</label>
        )}

        <h3>Perfil</h3>

        <RadioGroup
          className="perfil-radiogroup"
          value={perfilSelecionado}
          onChange={handlePerfilChange}
        >
          {roles.map((perfil) => (
            <FormControlLabel
              key={perfil?.name}
              value={perfil?._id}
              control={<Radio />}
              label={perfil?.name}
            />
          ))}
        </RadioGroup>

        <div className="double-buttons-user">
          <SecondaryButton text="Deletar" onClick={handleDeleteModal} />
          <PrimaryButton text="Salvar" onClick={handleSave} />
        </div>

        <Modal alertTitle="Alterações Salvas" show={showSaveModal}>
          <SecondaryButton
            key={"saveButtons"}
            text="OK"
            onClick={() => handleSaveCloseDialog()}
            width="338px"
          />
        </Modal>

        <Modal
          alertTitle="Deseja deletar o usuário do sistema?"
          show={showDeleteModal}
        >
          <SecondaryButton
            key={"deleteButtons"}
            text="EXCLUIR USUÁRIO"
            onClick={() => handleDelete()}
            width="338px"
          />
          <SecondaryButton
            key={"modalButtons"}
            text="CANCELAR E MANTER O CADASTRO"
            onClick={() => handleDeleteCloseDialog()}
            width="338px"
          />
        </Modal>
        <Modal alertTitle="Usuario Deletado" show={showDeletedModal}>
          <SecondaryButton
            key={"okButtons"}
            text="OK"
            onClick={() => handleDeletedCloseDialog()}
            width="338px"
          />
        </Modal>
      </div>
    </section>
  );
}
