export default function RecordVoiceVisualizer() {
    const bar1 = (
        <span
            className="playing__bar playing__bar1"
            style={{
                height: `${Math.floor(Math.random() * 100)}%`,
                animationDelay: `${Math.floor(Math.random() * 5)}s`,
            }}
        ></span>
    );
    const bar2 = (
        <span
            className="playing__bar playing__bar1"
            style={{
                height: `${Math.floor(Math.random() * 100)}%`,
                animationDelay: `${Math.floor(Math.random() * 5)}s`,
            }}
        ></span>
    );
    const bar3 = (
        <span
            className="playing__bar playing__bar1"
            style={{
                height: `${Math.floor(Math.random() * 100)}%`,
                animationDelay: `${Math.floor(Math.random() * 5)}s`,
            }}
        ></span>
    );
    const bar4 = (
        <span
            className="playing__bar playing__bar1"
            style={{
                height: `${Math.floor(Math.random() * 100)}%`,
                animationDelay: `${Math.floor(Math.random() * 5)}s`,
            }}
        ></span>
    );
    const bar5 = (
        <span
            className="playing__bar playing__bar1"
            style={{
                height: `${Math.floor(Math.random() * 100)}%`,
                animationDelay: `${Math.floor(Math.random() * 5)}s`,
            }}
        ></span>
    );

    const renderType = {
        bar1: { bar: 1, times: 7 },
        bar2: { bar: 2, times: 10 },
        bar3: { bar: 3, times: 15 },
        bar4: { bar: 4, times: 10 },
        bar5: { bar: 5, times: 7 },
    };

    const renderBar = (key, value) => {
        const renderArr = [];
        for (let i = 0; i <= Number(value.times); i++) {
            renderArr.push(
                <span
                    className={`playing__bar playing__bar${value.bar}`}
                    style={{
                        height: `${Math.floor(Math.random() * 100)}%`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                ></span>,
            );
        }
        return renderArr;
    };
    return (
        <div style={{ position: 'relative' }}>
            <div className="playing">
                {Object.entries(renderType).map(([key, value]) => {
                    return <>{renderBar(key, value)}</>;
                })}
            </div>
            <div
                className="playing"
                style={{ position: 'absolute', left: '-0.241px', bottom: '-44px', transform: 'rotate(3.142rad)' }}
            >
                {Object.entries(renderType)
                    .reverse()
                    .map(([key, value]) => {
                        return <>{renderBar(key, value)}</>;
                    })}
            </div>
        </div>
    );
}
