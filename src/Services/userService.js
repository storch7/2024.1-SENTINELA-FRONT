import { APIUsers } from "./BaseService";

const storagedToken = localStorage.getItem("@App:token");
let token = null;

if (storagedToken) {
  try {
    token = JSON.parse(storagedToken);
  } catch (error) {
    console.error("O token armazenado não é um JSON válido:", error);
  }
}

export async function userLogin(email, password) {
  try {
    const response = await APIUsers.post("/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getUsers = async () => {
  try {
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await APIUsers.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
  }
};

export const createUser = async (userData) => {
  try {
    await APIUsers.post("/signup", {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      status: userData.status,
      role: userData.role,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  }
};

export const getRoles = async () => {
  try {
    const response = await APIUsers.get("/role");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await APIUsers.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
};

export const patchUserById = async (id, updatedUser) => {
  try {
    const response = await APIUsers.patch(
      `/users/patch/${id}`,
      { updatedUser },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    throw error;
  }
};

export const sendRecoveryPassword = async (email) => {
  try {
    const message = APIUsers.post(`/users/recover-password`, {
      data: {
        email,
      },
    });

    return message;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserById = async (id) => {
  try {
    await APIUsers.delete(`/users/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, error);
  }
};

export const changePasswordById = async (newPassword, id) => {
  try {
    await APIUsers.patch(`/users/change-password/${id}`, {
      newPassword,
    });
  } catch (error) {
    return error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await APIUsers.post(`/verify-token`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error(`Token inválido`, error);
    throw error;
  }
};
