import sharedData from "@/assets/i18n/shared_data.json";

const { poem_a_boy_in_the_universe } = sharedData;

export const KindKang = () => {
  return (
    <div className="mb-12 text-center">
      <h3 className="text-2xl mb-6 text-[#d20033] selectable-text">A Boy in the Universe</h3>
      <div className="space-y-2">
        {poem_a_boy_in_the_universe.map((line, index) => (
          <p key={index} className="text-lg selectable-text italic">
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  );
};
export default KindKang;

