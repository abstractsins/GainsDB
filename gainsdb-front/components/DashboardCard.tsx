interface Props {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    description: string;
    id: string;
}
  
const InfoCard = ({ icon, title, value, description, id }: Props) => {

    const textLength = value.toString().length;
    const style = { "--char-count": textLength } as React.CSSProperties;  

    return (
        <div className="dashboard-card">
            <header className="dashboard-card">
                <div className="dashboard-card-icon">
                    {icon}
                </div>
                <h3>{title}</h3>
            </header>
            <div className="dashboard-card-body">
                <div className="dashboard-card-value-container">
                    <span 
                        className="dashboard-card-value"
                        style={style}
                        id={id}
                    >
                        {value}
                    </span>
                </div>
                <div className="dashboard-card-desc-container">
                    <aside>
                        {description}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
