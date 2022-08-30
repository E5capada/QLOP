import React from 'react';
import ProductItem from "../ProductItem/ProductItem";
import style from './Catalog.module.css'
import { connect } from 'react-redux'

const Catalog = (props) => {
    return (
        <div className={style.catalog}>
            <div className={style.catalog_title}>Каталог</div>
            <div className={style.catalog_wrap}>
                <div className={style.products}>
                    {props.catalogList.map(item =>
                        <ProductItem
                            key={item.id}
                            item={item}
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        catalogList: state.catalog.catalogList,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);