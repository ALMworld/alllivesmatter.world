import React from 'react';

import { DollarSign, Gavel, AlertCircle, CircleDollarSign, Scale, Heart, Building, Users, Landmark, Network, ImageUp, MailOpen, Mail } from 'lucide-react';

const AlmIconUnit = ({ value, ...props }) => {
    let IconComponent;
    let colorClass = "";
    let principleColorClass = "rounded-full rounded-xl  text-[#d20033] hover:bg-[#d20033] hover:text-yellow-300"; // Default color
    switch (value) {
        case 'money':
            IconComponent = CircleDollarSign
            colorClass = principleColorClass; // Special color for 'law'
            break;
        case 'love':
            IconComponent = Heart;
            colorClass = principleColorClass; // Special color for 'law'
            break;
        case 'law':
            IconComponent = Scale;
            colorClass = principleColorClass; // Special color for 'law'
            break;
        case 'landmark':
            IconComponent = Landmark;
            break;
        case 'users':
            IconComponent = Users;
            break;
        case 'network':
            IconComponent = Network;
            break;
        case 'image-up':
            IconComponent = ImageUp;
            break;
        case 'mail':
            IconComponent = Mail;
            break;
        default:
            IconComponent = Heart; // Default icon if no match is found
    }

    // return <IconComponent className={`${colorClass}`}
    //     {...props} />;
    return (
        <div className={`inline-flex items-center justify-center ${colorClass} p-1`}>
            <IconComponent {...props} />
        </div>
    )
};

export default AlmIconUnit;
