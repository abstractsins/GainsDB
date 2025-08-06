const ExeToolTip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="exe-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="intro">{`Volume: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default ExeToolTip