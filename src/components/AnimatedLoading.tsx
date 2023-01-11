import React from 'react';
import { Loader2, LucideLoader } from 'lucide-react';

const AnimatedLoading = () => {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center" >
                <LucideLoader size={100} />
            </div>
        </>
    );
};

export default AnimatedLoading;