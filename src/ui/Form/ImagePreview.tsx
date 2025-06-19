export default function ImagePreview({ imageUrlArr }: any) {
  return (
    <div>
      {imageUrlArr.length &&
        imageUrlArr.map((imageUrl: any) => (
          <img
            src={imageUrl.thumbnail_url}
            alt={imageUrl.public_id}
            key={imageUrl.public_id}
            style={{ width: "100px", height: "100px" }}
          />
        ))}
    </div>
  );
}
