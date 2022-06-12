import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { getListings } from "../features/listings/listingsSlice";
import Spinner from "../components/Spinner";
import FilterComponent from "../components/FilterComponent";

const Category = () => {
  const [showFilter, setShowFilter] = useState(false);
  const dispatch = useDispatch();
  const {
    loading,
    listings,
    error,
    page,
    searchKeyword,
    city,
    priceFrom,
    priceTo,
    surfaceFrom,
    surfaceTo,
  } = useSelector((state) => state.listings);
  const { categoryType } = useParams();

  useEffect(() => {
    const url_data = [
      categoryType,
      searchKeyword,
      city,
      priceFrom,
      priceTo,
      surfaceFrom,
      surfaceTo,
    ];
    dispatch(getListings(url_data));
  }, [
    dispatch,
    categoryType,
    searchKeyword,
    city,
    priceFrom,
    priceTo,
    surfaceFrom,
    surfaceTo,
  ]);

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
        Filtriranje
        <i
          className="fas fa-filter"
          onClick={() => setShowFilter(!showFilter)}
        ></i>
      </p>
      <main>
        <Row>
          <FilterComponent active={showFilter} />
        </Row>
        <Row className="mt-4">
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
