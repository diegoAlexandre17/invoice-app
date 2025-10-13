const TextErrorSmall = ({ error } : { error: string | undefined }) => {

  return (
    <small className="text-red-500 mt-1">
      {error}
    </small>
  );
};

export default TextErrorSmall;
