import React from 'react';

import { DollarSign, Gavel, AlertCircle, CircleDollarSign, Scale, Heart, Building, Users, Landmark } from 'lucide-react';

const AlmIcon = ({ value,...props }) => {
    let IconComponent;
    let color = "yellow";
    switch (value) {
        case 'money':
            IconComponent = CircleDollarSign
            break;
        case 'love':
            IconComponent = Heart;
            break;
        case 'law':
            IconComponent = Scale ;
            break;
        case 'landmark':
            IconComponent = Landmark ;
            break;
        case 'users':
            IconComponent = Users;
            break;
        default:
            IconComponent = Heart; // Default icon if no match is found
    }

    return <IconComponent  {...props} />;
};

export default AlmIcon;
