import { useEffect } from "react";
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { getListings } from "../features/listings/listingsSlice";
import Spinner from "../components/Spinner";

const Category = () => {
  const dispatch = useDispatch();
  const { loading, listings, error } = useSelector((state) => state.listings);
  const { categoryType } = useParams();

  useEffect(() => {
    dispatch(getListings([categoryType]));
  }, [dispatch, categoryType]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="pageContainerCategory" style={{ overflowX: "hidden" }}>
      <header>
        <p className="pageHeader">
          Nekretnine za {categoryType === "rent" ? "iznajmljivanje" : "prodaju"}
        </p>
      </header>
      <p className="filter">
        Filtriranje{" "}
        <i
          className="fas fa-filter"
          // onClick={() => dispatch({ type: "SET_SHOW_FILTER_FORM" })}
        ></i>
        *Not working yet*
      </p>
      <main>
        {/* <Row>
          <SearchComponent />
        </Row> */}
        <Row>
          <div className="category-listing-item">
            {listings !== null &&
              listings.map((listing, idx) => {
                return (
                  <ListingItem
                    key={listing._id}
                    id={listing._id}
                    data={listing}
                    index={idx}
                  />
                );
              })}
          </div>
        </Row>
      </main>
    </div>
  );
};

export default Category;
