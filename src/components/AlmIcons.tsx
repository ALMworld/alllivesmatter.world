import AlmIcon from "./AlmIcon";

const ActionIcons = ({ money, love, law }) => {
    return (
        <div className="flex space-x-1 mr-2">
            <AlmIcon value="money" size={16} className={money > 0 ? "text-yellow-400" : "text-gray-400"} />
            <AlmIcon value="love" size={16} className={love > 0 ? "text-yellow-400" : "text-gray-400"} />
            <AlmIcon value="law" size={16} className={law > 0 ? "text-yellow-400" : "text-gray-400"} />
        </div>
    );
};

export default ActionIcons;