import React, { createContext, useContext, useState } from "react";

// tipos permitidos para el modal
type ModalType = "success" | "error" | "info" | "warning";

// estructura de la configuración del modal
type ModalConfig = {
    visible: boolean;
    title: string;
    message: string;
    type: ModalType;
    onClose: () => void;
};

// contrato del contexto (lo que el Provider expone)
interface ModalContextType {
    modalConfig: ModalConfig;
    showModal: (
        title: string,
        message: string,
        onClose: () => void,
        type?: ModalType,
    ) => void;
    hideModal: () => void;
}

// Creamos el contexto con valor inicial undefined
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => { // 
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        visible: false,
        title: "",
        message: "",
        type: "info",
        onClose: () => {},
    });

    const showModal = (
        title: string,
        message: string,
        onClose: () => void,
        type: ModalType = "info",
    ) => {
        setModalConfig({ visible: true, title, message, type, onClose });
    };

    const hideModal = () =>
        setModalConfig((prev) => ({ ...prev, visible: false }));

    return (
        <ModalContext.Provider value={{ modalConfig, showModal, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
};

// validación de seguridad
export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal debe ser usado dentro de un ModalProvider");
    }
    return context;
};
