import { useCommonData } from "../data/data_provider";


{/* Poem section at the beginning */ }
{/* <div className="mb-12 text-center">
          <h3 className="text-2xl mb-6 text-[#d20033] selectable-text">A Boy in the Universe</h3>
          <div className="space-y-2">
            {commonData.poem_a_boy_in_the_universe.map((line, index) => (
              <p key={index} className="text-lg selectable-text italic">
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div> */}

export const KindKang = () => {
    const commonData = useCommonData();
    return (
        <div className="mb-12 text-center">
            <h3 className="text-2xl mb-6 text-[#d20033] selectable-text">A Boy in the Universe</h3>
            <div className="space-y-2">
                {commonData.poem_a_boy_in_the_universe.map((line, index) => (
                    <p key={index} className="text-lg selectable-text italic">
                        {line || '\u00A0'}
                    </p>
                ))}
            </div>
        </div>
    );
};
export default KindKang;
