import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//eslint-disable-next-line
import Spinner from "./Spinner";

const ListingItem = ({ id, data, onDelete, edit, index }) => {
  const { loading } = useSelector((state) => state.listings);
  const {
    bathroms,
    bedrooms,
    discountedPrice,
    images,
    regularPrice,
    surface,
    address,
  } = data;
  //eslint-disable-next-line
  const navigate = useNavigate();

  const handleClick = async (e) => {
    //delete document
    // if (
    //   e.target.classList.contains("fa-trash") ||
    //   e.target.classList.contains("deleteListing")
    // ) {
    //   dispatchListings({ type: "SET_SHOW_MODAL", payload: id });
    //   //setujemo showModal state na true i proslijeđujemo id
    // } else if (
    //   //edit document
    //   e.target.classList.contains("fa-edit") ||
    //   e.target.classList.contains("editListing")
    // ) {
    //   dispatchListings({ type: "SET_EDIT_LISTING_ID", payload: id });
    //   navigate(`/edit-listing/${id}`);
    // } else {
    //   //Proslijeđujemo korisnika na stranicu koja prikazuje kliknuti dokument zasebno i opširnije. Ruta je /listing/ i id dokumenta.
    //   navigate(`/listing/${id}`);
    // }
  };

  return (
    data !== undefined && (
      <>
        <div className="listingItem" onClick={handleClick} id="listing-item">
          <p className="listingPrice">
            {regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {"KM"}
            {/* {data?.type === "rent" ? "mjesečno" : ""} */}
          </p>
          <div
            className="listingItemImg"
            style={{
              backgroundImage: `url(${images[0]})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <ul className="listingMoreInfo">
            <li className="icons">
              <i className="fas fa-map-marker-alt" />
              {address}
            </li>
            <li>
              <i className="fas fa-object-group" />
              {surface}m2
            </li>
            {discountedPrice !== 0 && (
              <li className="icons">
                <i className="fas fa-tag" />
                Snižena cijena :{" "}
                {/* {data?.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                {`KM`} */}
              </li>
            )}
            <li className="iconsForResponsive">
              <i className="fas fa-bed" />
              {bedrooms}
            </li>
            <li className="iconsForResponsive">
              <i className="fas fa-bath" />
              {bathroms}
            </li>
          </ul>
          {onDelete && (
            <button className="deleteListing">
              <i className="fas fa-trash"></i>
            </button>
          )}
          {edit && (
            <button className="editListing">
              <i className="fas fa-edit"></i>
            </button>
          )}
        </div>

        {/* {showModal && <ModalComponent />} */}
      </>
    )
  );
};

ListingItem.defaultProps = {
  index: "",
};

export default ListingItem;
