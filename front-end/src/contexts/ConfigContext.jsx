import PropTypes from 'prop-types';
import { createContext } from 'react';

// project import
import defaultConfig from '../config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
    ...defaultConfig,
    onChangeMode: () => {},
    onChangePresetColor: () => {},
    onChangeFontFamily: () => {},
    onChangeBorderRadius: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

function ConfigProvider({ children }) {
    const [config, setConfig] = useLocalStorage('berry-config-vite-js', {
        mode: initialState.mode,
        presetColor: initialState.presetColor,
        fontFamily: initialState.fontFamily,
        borderRadius: initialState.borderRadius,
    });

    const onChangeMode = (mode) => {
        setConfig({
            ...config,
            mode
        });
    };

    const onChangePresetColor = (presetColor) => {
        setConfig({
            ...config,
            presetColor
        });
    };

    const onChangeFontFamily = (fontFamily) => {
        setConfig({
            ...config,
            fontFamily
        });
    };

    const onChangeBorderRadius = (event, newValue) => {
        setConfig({
            ...config,
            borderRadius: newValue
        });
    };


    return (
        <ConfigContext.Provider
            value={{
                ...config,
                onChangeMode,
                onChangePresetColor,
                onChangeFontFamily,
                onChangeBorderRadius,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}

ConfigProvider.propTypes = {
    children: PropTypes.node
};

export { ConfigProvider, ConfigContext };