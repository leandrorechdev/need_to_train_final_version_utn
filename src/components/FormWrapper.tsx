import React from "react";
import { View, StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";

interface FormWrapperProps {
    children: React.ReactNode;
    withScroll?: boolean;
}

export default function FormWrapper({ children, withScroll = true }: FormWrapperProps) {
    return (
        <ScreenWrapper withScroll={withScroll}>
            <View style={styles.formPadding}>
                {children}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    formPadding: {
        paddingHorizontal: 16,
    },
});