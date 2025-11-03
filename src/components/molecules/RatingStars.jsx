import ApperIcon from "@/components/ApperIcon";

const RatingStars = ({ rating, maxRating = 5, size = "sm", showValue = true, className = "" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= rating;
    const isHalf = i - 0.5 === rating;
    
    stars.push(
      <ApperIcon
        key={i}
        name={isFilled || isHalf ? "Star" : "Star"}
        className={`${sizeClasses[size]} ${
          isFilled ? "text-accent fill-accent" : "text-gray-300"
        }`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">{stars}</div>
      {showValue && (
        <span className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;